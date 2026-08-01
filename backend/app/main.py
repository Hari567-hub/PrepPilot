import time
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import get_db, Base, engine
from . import models, schemas
from .services.ai_service import AIService

# Initialize tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create tables: {e}")

app = FastAPI(title="InterviewPrep AI API", version="1.0.0")

# Enable CORS for frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, swap with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory rate limiting database
rate_limit_db = {}

class RateLimitingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Exempt health check from rate limiting
        if request.url.path == "/health":
            return await call_next(request)
            
        client_ip = request.client.host if request.client else "unknown"
        current_time = time.time()
        
        if client_ip not in rate_limit_db:
            rate_limit_db[client_ip] = []
            
        rate_limit_db[client_ip] = [t for t in rate_limit_db[client_ip] if current_time - t < 60]
        
        if len(rate_limit_db[client_ip]) >= 100:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down."}
            )
            
        rate_limit_db[client_ip].append(current_time)
        return await call_next(request)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(RateLimitingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

ai_service = AIService()

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

@app.post("/users", response_model=schemas.UserResponse)
def sync_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    if db_user:
        # Update user profile if exists
        for key, value in user.dict().items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    # Create new profile
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/users/{user_id}/attempts", response_model=schemas.MockAttemptResponse)
def create_attempt(user_id: str, attempt: schemas.MockAttemptCreate, db: Session = Depends(get_db)):
    db_attempt = models.MockAttempt(user_id=user_id, **attempt.dict())
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    return db_attempt

@app.get("/users/{user_id}/attempts", response_model=List[schemas.MockAttemptResponse])
def get_attempts(user_id: str, db: Session = Depends(get_db)):
    return db.query(models.MockAttempt).filter(models.MockAttempt.user_id == user_id).all()

# Notes Router endpoints
@app.post("/users/{user_id}/notes", response_model=schemas.NoteResponse)
def create_note(user_id: str, note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Note(user_id=user_id, **note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/users/{user_id}/notes", response_model=List[schemas.NoteResponse])
def get_notes(user_id: str, db: Session = Depends(get_db)):
    return db.query(models.Note).filter(models.Note.user_id == user_id).all()

@app.put("/users/{user_id}/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(user_id: str, note_id: str, note: schemas.NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    for key, val in note.dict(exclude_unset=True).items():
        setattr(db_note, key, val)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/users/{user_id}/notes/{note_id}")
def delete_note(user_id: str, note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted successfully"}

# Global AI evaluation gateway
@app.post("/evaluate")
async def evaluate_answer(payload: dict):
    q = payload.get("question")
    ans = payload.get("answer")
    cat = payload.get("category", "General")
    if not q or not ans:
        raise HTTPException(status_code=400, detail="Missing question or answer text fields")
    
    evaluation = await ai_service.evaluate_answer(q, ans, cat)
    return evaluation
