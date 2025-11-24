import io
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, StreamingResponse
from PIL import Image
from ultralytics import YOLO

model = YOLO("models/yolov8n.pt")

router = APIRouter(
    prefix="/yolo",
    tags=["Yolo"]
)

@router.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    results = model.predict(source=image, save=False)
    
    detections = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            detections.append({
                "object": class_name,
                "confidence": confidence,
                "bounding_box": [x1, y1, x2, y2]
            })
    
    annotated_image = results[0].plot()
    buffer = io.BytesIO()
    annotated_image.save(buffer, format="PNG")
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png", headers={
        "X-Detections": str(detections)
    })
