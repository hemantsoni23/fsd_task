from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from typing import Optional
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
import pytz
import threading
import os
import asyncio

app = FastAPI()

# Secret and algorithm for JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


IST = pytz.timezone("Asia/Kolkata")

# OAuth2 for login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Path to the CSV file
CSV_FILE_PATH = "backend_table.csv"

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
            redis_client.set(name=f"random_number:{timestamp}", value=number, ex=30) 
        except Exception as e:
            print(f"Error in generating numbers: {e}")
        await asyncio.sleep(1)  

@app.post("/register")
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

@app.post("/login")
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


@app.get("/random_numbers", dependencies=[Depends(validate_token)])
async def get_random_numbers():
    try:
        keys = redis_client.keys(pattern="random_number:*")
        numbers = []
        for key in keys:
            timestamp = key.split("random_number:")[1]
            value = redis_client.get(key)
            if value is not None:
                numbers.append({"timestamp": timestamp, "number": float(value)})
        return {"random_numbers": sorted(numbers, key=lambda x: x["timestamp"])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching random numbers: {e}")


@app.get("/csv", dependencies=[Depends(validate_token)])
async def fetch_csv():
    """
    Fetch CSV File: Retrieve the contents of the backend_table.csv file.
    """
    data = read_csv_with_pandas(CSV_FILE_PATH)
    return {"data": data.to_dict(orient="records")}


@app.post("/csv", dependencies=[Depends(validate_token)])
async def add_row(data: dict):
    """
    Create Operation: Add a new row to the CSV file.
    """
    create_backup(CSV_FILE_PATH)
    df = read_csv_with_pandas(CSV_FILE_PATH)
    df = df.append(data, ignore_index=True)
    write_csv_with_pandas(CSV_FILE_PATH, df)
    return {"message": "Row added successfully"}


@app.put("/csv", dependencies=[Depends(validate_token)])
async def update_row(data: dict):
    """
    Update Operation: Update an existing row in the CSV file.
    """
    create_backup(CSV_FILE_PATH)
    df = read_csv_with_pandas(CSV_FILE_PATH)
    df.loc[df["user"] == data["user"], :] = data
    write_csv_with_pandas(CSV_FILE_PATH, df)
    return {"message": "Row updated successfully"}


@app.delete("/csv", dependencies=[Depends(validate_token)])
async def delete_row(user: str):
    """
    Delete Operation: Delete a row from the CSV file.
    """
    create_backup(CSV_FILE_PATH)
    df = read_csv_with_pandas(CSV_FILE_PATH)
    df = df[df["user"] != user]
    write_csv_with_pandas(CSV_FILE_PATH, df)
    return {"message": "Row deleted successfully"}
