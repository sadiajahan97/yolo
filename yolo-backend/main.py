from fastapi import FastAPI
from routers import yolo

app = FastAPI()

app.include_router(yolo.router)
