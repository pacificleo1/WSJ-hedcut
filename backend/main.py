from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import cv2
import numpy as np
from PIL import Image
import io
import os

app = FastAPI()

# Configure CORS with your Vercel frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-app.vercel.app"],  # Update this with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_hedcut_effect(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 2
    )
    
    # Create stipple effect
    dots = np.zeros_like(gray)
    for i in range(0, gray.shape[0], 3):
        for j in range(0, gray.shape[1], 3):
            if i+3 <= gray.shape[0] and j+3 <= gray.shape[1]:
                block = gray[i:i+3, j:j+3]
                if np.mean(block) < 128:
                    dots[i+1, j+1] = 255
    
    # Combine effects
    result = cv2.bitwise_and(thresh, dots)
    
    return result

@app.post("/convert")
async def convert_image(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Process image
    result = create_hedcut_effect(image)
    
    # Save result
    temp_file = "temp_result.png"
    cv2.imwrite(temp_file, result)
    
    # Return processed image
    return FileResponse(temp_file)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)