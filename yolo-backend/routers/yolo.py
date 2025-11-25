import base64
import io
from fastapi import APIRouter, Depends, File, HTTPException, status, UploadFile
from middlewares import verify_access_token
from PIL import Image
from ultralytics import YOLO

model = YOLO("models/yolov8n.pt")

router = APIRouter(
    prefix="/yolo",
    tags=["Yolo"]
)

@router.post("/detect")
async def detect_objects(
    file: UploadFile = File(...),
    user: dict = Depends(verify_access_token)
):
    try:
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
                    "boundingBox": [x1, y1, x2, y2]
                })
        
        annotated_image = Image.fromarray(results[0].plot())
        buffer = io.BytesIO()
        annotated_image.save(buffer, format="PNG")
        buffer.seek(0)
        
        image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        
        return {
            "annotatedImage": f"data:image/png;base64,{image_base64}",
            "detections": detections
        }
    
    except HTTPException:
        raise
    except Exception as exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(exception)}"
        )
