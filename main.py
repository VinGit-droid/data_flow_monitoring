import os
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
from dotenv import load_dotenv
from prefect_flow.flow import clean_and_store

load_dotenv()
os.environ["PREFECT_API_URL"] = ""

UPLOAD_DIR = Path(os.getenv("RAW_UPLOAD_DIR", "./uploads/raw"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="DataFlow Monitor - Ingest")

@app.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    file_path = UPLOAD_DIR / f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    with open(file_path, 'wb') as f:
        f.write(content)
    try:
        result = clean_and_store(file_path=str(file_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return JSONResponse({"status": "ok", "prefect_result": result})
