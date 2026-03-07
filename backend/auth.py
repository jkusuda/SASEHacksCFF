# auth.py
import os
from fastapi import Depends, Header, HTTPException
from db import supabase
from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: str
    email: Optional[str] = None

async def get_current_user(authorization: str = Header(...)) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.split(" ")[1]
    
    try:
        response = supabase.auth.get_user(token)
        user_data = response.user
        
        if not user_data:
             raise HTTPException(status_code=401, detail="Invalid token")
             
        # Extract fields
        return User(id=str(user_data.id), email=user_data.email)
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
