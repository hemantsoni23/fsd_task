from fastapi import FastAPI, Depends, HTTPException, status, Request, Query
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from app.config.configRedis import redis_client
from app.config.configMongodb import client as mongodb_client
from app.utils import (
    generate_random_number,
    validate_token,
    lock_file,
    create_backup,
    read_csv_with_pandas,
    write_csv_with_pandas,
)
from datetime import datetime, timedelta
import time, pytz, threading, os, asyncio, json
import pandas as pd

app = FastAPI()

# Secret and algorithm for JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


IST = pytz.timezone("Asia/Kolkata")

# Path to the CSV file
CSV_FILE_PATH = "backend_table.csv"

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload 
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

@app.get('/')
def read_root():
    return {"Hello": "World"}

@app.on_event("startup")
async def start_background_tasks():
    asyncio.create_task(generate_numbers_task())

async def generate_numbers_task():
    while True:
        try:
            number = generate_random_number()
            utc_now = datetime.utcnow()
            ist_now = utc_now.replace(tzinfo=pytz.utc).astimezone(IST)
            timestamp = ist_now.isoformat()
            redis_client.zadd("random_numbers", {json.dumps({"timestamp": timestamp, "number": number}): ist_now.timestamp()})
            redis_client.zremrangebyscore("random_numbers", 0, (datetime.utcnow() - timedelta(seconds=30)).timestamp())
        except Exception as e:
            print(f"Error in generating numbers: {e}")
        await asyncio.sleep(1)

@app.post("/api/auth/register")
async def register(request: Request):
    try:
        user_data = await request.json()
        if not isinstance(user_data, dict):
            raise HTTPException(status_code=400, detail="Input must be a valid dictionary.")
        
        users_collection = mongodb_client["python"]["users"]
        existing_user = users_collection.find_one({"username": user_data.get("username")})
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists.")
        
        users_collection.insert_one(user_data)
        token_data = {"sub": user_data["username"], "exp": datetime.utcnow() + timedelta(hours=1)}
        access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": access_token, "token_type": "bearer", "message": "User registered successfully!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

@app.post("/api/auth/login")
async def login(request: Request):
    try:
        form_data = await request.json()
        users_collection = mongodb_client["python"]["users"]
        user = users_collection.find_one({"username": form_data.get("username")})
        if not user or user["password"] != form_data.get("password"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        token_data = {"sub": form_data.get("username"), "exp": datetime.utcnow() + timedelta(hours=1)}
        access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": access_token, "token_type": "bearer", "message": "User login successfully!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")

def sse_stream():
    last_timestamp = None 
    
    try:
        raw_numbers = redis_client.zrange("random_numbers", -20, -1)
        numbers = [json.loads(item) for item in raw_numbers]
        
        yield f"data: {json.dumps(numbers)}\n\n"
        
        if numbers:
            last_timestamp = datetime.fromisoformat(numbers[-1]["timestamp"]).timestamp()
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    while True:
        try:
            min_score = f"({last_timestamp}" if last_timestamp else "-inf"
            raw_numbers = redis_client.zrangebyscore("random_numbers", min_score, "+inf")
            latest_numbers = [json.loads(item) for item in raw_numbers]  

            if latest_numbers:
                yield f"data: {json.dumps(latest_numbers)}\n\n"
                last_timestamp = datetime.fromisoformat(latest_numbers[-1]["timestamp"]).timestamp()
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        time.sleep(1)  

@app.get("/sse/random_numbers")
async def send_random_numbers(token: str = Query(None)):
    if not token:
        raise HTTPException(status_code=401, detail="Authentication token is required")
    
    verify_token(token)
    return StreamingResponse(sse_stream(), media_type="text/event-stream")

# @app.websocket("/ws/random_numbers")
# async def websocket_endpoint(websocket: WebSocket):
#     token = websocket.query_params.get("token")
    # if not token:
    #     await websocket.close(code=4001, reason="Authentication token required")
    #     return

    # try:
    #     verify_token(token)
    # except HTTPException:
    #     await websocket.close(code=4001, reason="Invalid authentication token")
    #     return

#     await websocket.accept()
#     try:
        # while True:
        #     raw_numbers = redis_client.zrange("random_numbers", -20, -1)
        #     numbers = [json.loads(item) for item in raw_numbers]

        #     await websocket.send_text(json.dumps(numbers))
        #     await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         print("WebSocket connection closed")
#     except Exception as e:
#         print(f"WebSocket error: {e}")
#         await websocket.close()


@app.get("/api/csv", dependencies=[Depends(validate_token)])
async def fetch_csv():
    """
    Fetch CSV File: Retrieve the contents of the backend_table.csv file.
    """
    data = read_csv_with_pandas(CSV_FILE_PATH)
    return {"data": data.to_dict(orient="records")}


@app.post("/api/csv", dependencies=[Depends(validate_token)])
async def add_row(data: dict):
    """
    Create Operation: Add a new row to the CSV file.
    """
    create_backup(CSV_FILE_PATH)
    df = read_csv_with_pandas(CSV_FILE_PATH)
    df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)
    write_csv_with_pandas(CSV_FILE_PATH, df)
    return {"message": "Row added successfully"}


@app.put("/api/csv", dependencies=[Depends(validate_token)])
async def update_row(data: dict):
    """
    Update Operation: Update an existing row in the CSV file.
    """
    create_backup(CSV_FILE_PATH)
    df = read_csv_with_pandas(CSV_FILE_PATH)

    try:
        for column in df.columns:
            if column in data:
                if df[column].dtype == 'float64':
                    try:
                        data[column] = float(data[column])
                    except ValueError:
                        return {"error": f"Invalid value for column '{column}': {data[column]}"}

        # Update row
        df.loc[df["user"] == data["user"], :] = pd.DataFrame([data]).reindex(columns=df.columns).values

    except KeyError as e:
        return {"error": f"KeyError: {e}. Ensure 'data' keys match DataFrame columns."}
    except ValueError as e:
        return {"error": f"ValueError: {e}. Ensure 'data' has correct structure."}

    write_csv_with_pandas(CSV_FILE_PATH, df)
    return {"message": "Row updated successfully"}

@app.delete("/api/csv", dependencies=[Depends(validate_token)])
async def delete_row(user: str):
    """
    Delete Operation: Delete a row from the CSV file.
    """
    create_backup(CSV_FILE_PATH)
    df = read_csv_with_pandas(CSV_FILE_PATH)
    df = df[df["user"] != user]
    write_csv_with_pandas(CSV_FILE_PATH, df)
    return {"message": "Row deleted successfully"}

@app.post("/api/csv/restore", dependencies=[Depends(validate_token)])
async def restore_csv():
    """
    Restore the original CSV file using the most recent backup file.
    """
    try:
        backup_files = [
            file for file in os.listdir(".") if file.startswith(CSV_FILE_PATH) and file.endswith(".bak")
        ]
        if not backup_files:
            raise HTTPException(status_code=404, detail="No backup files found.")

        with open(backup_files[0], "r") as backup, open(CSV_FILE_PATH, "w") as original:
            original.write(backup.read())

        return {"message": "CSV file restored successfully from the latest backup."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error restoring CSV: {str(e)}")