import bcrypt
import jwt
import os
from database import prisma
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from fastapi import APIRouter, Body, HTTPException, Response, status
from pydantic import EmailStr

load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/sign-up", status_code=status.HTTP_201_CREATED)
async def sign_up(
    email: EmailStr = Body(...),
    password: str = Body(...),
    name: str = Body(...)
):
    try:
        existing_user = await prisma.user.find_unique(where={"email": email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        await prisma.user.create(
            data={
                "email": email,
                "hashedPassword": hashed_password,
                "name": name
            }
        )
        
        return {
            "message": "User created successfully"
        }
    
    except HTTPException:
        raise
    except Exception as exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(exception)}"
        )

@router.post("/sign-in")
async def sign_in(
    response: Response,
    email: EmailStr = Body(...),
    password: str = Body(...)
):
    try:
        user = await prisma.user.find_unique(where={"email": email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        password_valid = bcrypt.checkpw(
            password.encode('utf-8'),
            user.hashedPassword.encode('utf-8')
        )
        
        if not password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        jwt_secret = os.getenv("JWT_SECRET_KEY")
        if not jwt_secret:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="JWT secret key not configured"
            )
        
        expiration_time = datetime.now(timezone.utc) + timedelta(hours=24)
        
        payload = {
            "id": user.id,
            "email": user.email,
            "exp": int(expiration_time.timestamp())
        }
        
        access_token = jwt.encode(
            payload,
            jwt_secret,
            algorithm="HS256"
        )
        
        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=86400,
            httponly=True,
            secure=True,
            samesite="none",
            path="/"
        )
        
        return {
            "message": "Sign in successful"
        }
    
    except HTTPException:
        raise
    except Exception as exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(exception)}"
        )

@router.post("/sign-out")
async def sign_out(response: Response):
    try:
        response.delete_cookie(
            key="access_token",
            path="/",
            samesite="none",
            secure=True,
            httponly=True
        )
        
        return {
            "message": "Sign out successful"
        }
    
    except HTTPException:
        raise
    except Exception as exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(exception)}"
        )
