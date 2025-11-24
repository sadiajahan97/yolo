import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

router = APIRouter(
    prefix="/gemini",
    tags=["Gemini"]
)

class AskRequest(BaseModel):
    detections: list
    question: str

@router.post("/ask")
async def ask_question(request: AskRequest):
    prompt = f"""
You are an assistant that answers questions about YOLO object detections.

Detections:
{request.detections}

User question:
{request.question}

Answer concisely based only on the detection data.
"""

    response = model.generate_content(prompt)

    return {"answer": response.text}
