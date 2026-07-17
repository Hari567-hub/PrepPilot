from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/interviewprep"
    OPENAI_API_KEY: str = "sk-placeholder"
    
    # Storage Options
    STORAGE_BUCKET_NAME: Optional[str] = "interviewprep-resumes"
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
