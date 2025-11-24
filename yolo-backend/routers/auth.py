import bcrypt
from database import prisma
from fastapi import APIRouter, Body, HTTPException, status
from pydantic import EmailStr

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
