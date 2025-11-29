from database import prisma
from fastapi import APIRouter, Depends, HTTPException, status
from middlewares import verify_access_token

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.get("/profile")
async def get_profile(
    user: dict = Depends(verify_access_token)
):
    try:
        profile = await prisma.user.find_unique(
            where={"id": user["id"]}
        )
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        
        return {
            "email": profile.email,
            "name": profile.name
        }
    
    except HTTPException:
        raise
    except Exception as exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(exception)}"
        )
