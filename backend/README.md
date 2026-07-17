# InterviewPrep AI Backend (FastAPI)

Production-ready modular backend for InterviewPrep AI.

## Technical Setup

### Prerequisites
- Python 3.10+
- PostgreSQL database

### Local Running

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   Create a `.env` file inside the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/interviewprep
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the API Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The API will be running at [http://localhost:8000](http://localhost:8000). You can check docs at [http://localhost:8000/docs](http://localhost:8000/docs).

## Deployment

### Railway / Render Setup
1. Fork/push this repository to GitHub.
2. Select the `backend` subdirectory during deployment.
3. Configure environment variables in the service dashboard:
   - `DATABASE_URL` (Link to active PostgreSQL resource)
   - `OPENAI_API_KEY` (Your OpenAI credential)
