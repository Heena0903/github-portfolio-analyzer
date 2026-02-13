from fastapi import FastAPI
import requests
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv(dotenv_path=".env")

app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini key loaded:", bool(GEMINI_API_KEY))


@app.post("/generate-feedback")
def generate_feedback(data: dict):

    metrics = data.get("metrics")

    prompt = f"""
You are a senior engineering recruiter.

Evaluate the GitHub profile using the provided metrics.

Metrics:
{metrics}

Return STRICT JSON ONLY in this structure:

{{
  "profileStrength": "Weak / Average / Strong",
  "recruiterFirstNotice": [
    "point 1",
    "point 2"
  ],
  "keyStrengths": [
    "strength 1",
    "strength 2"
  ],
  "reposToImprove": [
    "repo1",
    "repo2"
  ],
  "howToImproveProjects": [
    "improvement 1",
    "improvement 2"
  ],
  "nextSteps": [
    "next step 1",
    "next step 2",
    "next step 3"
  ],
  "hiringSignal": "Strong Hire / Hire / Consider / Weak"
}}

Keep responses concise, recruiter-focused, and actionable.
"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

    response = requests.post(
        url,
        json={
            "contents": [{"parts": [{"text": prompt}]}]
        }
    )

    result = response.json()

    if "candidates" not in result:
        return {"feedback": f"Gemini API Error: {result}"}

    ai_text = result["candidates"][0]["content"]["parts"][0]["text"]

    return {"feedback": ai_text}

