import google.generativeai as genai
import io
import json
import os
from dotenv import load_dotenv
from fastapi import APIRouter, File, Form, UploadFile
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
    question: str = Form(...)
):
    detections_list = json.loads(detections)
    
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    prompt = f"""
You are an assistant that answers questions about YOLO object detections.

Detections:
{detections_list}

User question:
{question}

Answer concisely based on both the detection data and the image provided.
"""

    response = model.generate_content([image, prompt])

    return {"answer": response.text}
