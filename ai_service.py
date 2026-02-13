from fastapi import FastAPI
import requests
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")


app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("Gemini key loaded:", bool(GEMINI_API_KEY))

@app.post("/generate-feedback")
def generate_feedback(data: dict):

    metrics = data.get("metrics")

    prompt = f"""
    Evaluate this GitHub profile like a recruiter.

    Metrics:
    {metrics}

    Provide:
    - Strengths
    - Red flags
    - Actionable suggestions
    """

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

    response = requests.post(
        url,
        json={
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }
    )

    result = response.json()

    if "candidates" not in result:
        return {"feedback": f"Gemini API Error: {result}"}

    ai_text = result["candidates"][0]["content"]["parts"][0]["text"]

    return {"feedback": ai_text}
