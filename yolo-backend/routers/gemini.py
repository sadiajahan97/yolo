import google.generativeai as genai
import io
import json
import os
from database import prisma
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, File, Form, UploadFile
from middlewares import verify_access_token
from PIL import Image

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

router = APIRouter(
    prefix="/gemini",
    tags=["Gemini"]
)

@router.post("/ask")
async def ask_question(
    file: UploadFile = File(...),
    detections: str = Form(...),
    question: str = Form(...),
    user: dict = Depends(verify_access_token)
):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    await prisma.message.create(
        data={
            "userId": user["id"],
            "content": question,
            "role": "user"
        }
    )
    
    prompt = f"""
You are an assistant that answers questions about YOLO object detections.

Detections:
{detections}

User question:
{question}

Answer concisely based on both the detection data and the image provided.
"""

    response = model.generate_content([image, prompt])

    await prisma.message.create(
        data={
            "userId": user["id"],
            "content": response.text,
            "role": "assistant"
        }
    )

    return {"answer": response.text}
