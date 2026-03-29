from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn
from core.cv_parser import parse_floor_plan
from core.geometry import reconstruct_geometry
from core.materials import analyze_materials
from core.llm import generate_explanations

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Structural Intelligence API")

# Add CORS middleware to allow Next.js frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://127.0.0.1:9002"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/process-floorplan")
async def process_floorplan(file: UploadFile = File(...)):
    try:
        # 1. Read image
        content = await file.read()
        
        # 2. Parse Floor Plan (CV)
        cv_data = parse_floor_plan(content)
        if cv_data.get("status") == "error":
            return {"status": "error", "message": "Failed to parse floor plan image"}
        
        # 3. Geometry Reconstruction (Graph)
        graph_data = reconstruct_geometry(cv_data)
        
        # 4. Material Analysis
        materials_data = analyze_materials(graph_data)
        
        # 5. Explainability (LLM)
        explanations = generate_explanations(materials_data)
        
        return {
            "status": "success",
            "model3D": graph_data,
            "materials": materials_data,
            "explanations": explanations
        }
    except Exception as e:
        print(f"Backend Exception: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
