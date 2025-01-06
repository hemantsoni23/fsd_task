import pandas as pd
from datetime import datetime
from contextlib import contextmanager
import threading
from jose import jwt, JWTError
from fastapi import HTTPException, status, Request
import os


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

# Mutex lock for file handling
file_lock = threading.Lock()

@contextmanager
def lock_file(file_path):
    file_lock.acquire()
    try:
        yield
    finally:
        file_lock.release()


def create_backup(file_path):
    backup_file = f"{file_path}_{datetime.now().strftime('%Y%m%d%H%M%S')}.bak"
    with open(file_path, "r") as original, open(backup_file, "w") as backup:
        backup.write(original.read())


def read_csv_with_pandas(file_path):
    return pd.read_csv(file_path)


def write_csv_with_pandas(file_path, df):
    df.to_csv(file_path, index=False)


def generate_random_number():
    import random
    return random.uniform(0, 10000)

def validate_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

