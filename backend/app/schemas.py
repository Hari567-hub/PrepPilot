from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    experience_tier: str
    target_role: str
    target_company: str
    skills: List[str]

class UserCreate(UserBase):
    id: str # UID from Auth provider

class UserUpdate(BaseModel):
    name: Optional[str] = None
    experience_tier: Optional[str] = None
    target_role: Optional[str] = None
    target_company: Optional[str] = None
    skills: Optional[List[str]] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True


# MockAttempt Schemas
class MockAttemptBase(BaseModel):
    type: str
    company: str
    role: str
    score: int
    feedback: Optional[str] = None
    better_answer: Optional[str] = None

class MockAttemptCreate(MockAttemptBase):
    pass

class MockAttemptResponse(MockAttemptBase):
    id: int
    user_id: str
    date: datetime
    class Config:
        from_attributes = True


# Resume Analyzer Schemas
class ResumeReportBase(BaseModel):
    filename: str
    ats_score: int
    missing_keywords: List[str]
    grammar_issues: List[dict]
    improvement_tips: List[str]

class ResumeReportCreate(ResumeReportBase):
    pass

class ResumeReportResponse(ResumeReportBase):
    id: int
    user_id: str
    created_at: datetime
    class Config:
        from_attributes = True


# Note Schemas
class NoteBase(BaseModel):
    title: str
    content: str
    folder: str

class NoteCreate(NoteBase):
    id: str

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    folder: Optional[str] = None

class NoteResponse(NoteBase):
    id: str
    user_id: str
    updated_at: datetime
    class Config:
        from_attributes = True
