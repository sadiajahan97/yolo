from contextlib import asynccontextmanager
from database import prisma
from fastapi import FastAPI
from routers import auth, gemini, yolo

@asynccontextmanager
async def lifespan(app: FastAPI):
    await prisma.connect()
    yield
    await prisma.disconnect()

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(gemini.router)
app.include_router(yolo.router)
