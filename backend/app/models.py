import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Matches Supabase / Firebase Auth UID
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    experience_tier = Column(String, default="Fresher")
    target_role = Column(String, default="Software Engineer")
    target_company = Column(String, default="Google")
    skills = Column(JSON, default=list) # Array of skills strings
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    attempts = relationship("MockAttempt", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("ResumeReport", back_populates="user", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")


class MockAttempt(Base):
    __tablename__ = "mock_attempts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False) # e.g. "Mock", "Coding", "HR", "System Design"
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    feedback = Column(String, nullable=True)
    better_answer = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="attempts")


class ResumeReport(Base):
    __tablename__ = "resume_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    ats_score = Column(Integer, nullable=False)
    missing_keywords = Column(JSON, default=list)
    grammar_issues = Column(JSON, default=list)
    improvement_tips = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")


class Note(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, default="Untitled Note")
    content = Column(String, default="")
    folder = Column(String, default="General")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notes")
