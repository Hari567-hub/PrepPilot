import openai
from ..config import settings

class AIService:
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "sk-placeholder":
            self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    async def evaluate_answer(self, question: str, answer: str, category: str) -> dict:
        """
        Uses OpenAI GPT-4 to score an interview answer on communication, technical skill, and confidence.
        """
        if not self.client:
            # Fallback mock logic for testing environments
            return {
                "score": 80,
                "feedback": "Strong answer structure. Incorporating more active metrics would improve outcomes.",
                "better_answer": "STAR framework template: Situation context -> Actions taken -> Measurable result percentages.",
                "confidence_rating": 85,
                "communication_rating": 8,
                "technical_rating": 8
            }

        prompt = f"""
        Evaluate the following response to an interview question.
        Question: {question}
        User Answer: {answer}
        Category: {category}

        Provide a JSON response with exactly the following keys:
        - score (integer 0-100)
        - feedback (string summarizing strengths and improvement tips)
        - better_answer (string outline showing how to answer this optimally)
        - confidence_rating (integer 0-100)
        - communication_rating (integer 1-10)
        - technical_rating (integer 1-10)
        """

        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        import json
        return json.loads(response.choices[0].message.content)

    async def transcribe_audio(self, audio_file_path: str) -> str:
        """
        Uses OpenAI Whisper to transcribe user recorded voice audio.
        """
        if not self.client:
            return "Simulated audio transcription text."

        with open(audio_file_path, "rb") as audio:
            transcription = self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio
            )
            return transcription.text
