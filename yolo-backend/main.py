from fastapi import FastAPI
from routers import gemini, yolo

app = FastAPI()

app.include_router(gemini.router)

app.include_router(yolo.router)
