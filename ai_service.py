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
    You are an AI recruiter evaluating a developer GitHub portfolio.

    Using the metrics below:
    {metrics}

    Evaluate based on:
    - Engineering depth
    - Documentation quality
    - Consistency of contributions
    - Real-world project impact

    Return STRICT JSON ONLY in this format:

    {{
      "portfolioScore": "<score summary>",
      "keyStrengths": [
        "strength1",
        "strength2",
        "strength3"
      ],
      "redFlags": [
        "flag1",
        "flag2"
      ],
      "actionableSuggestions": [
        "suggestion1",
        "suggestion2",
        "suggestion3"
      ],
      "hiringSignal": "<Strong / Moderate / Weak>",
    }}
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

    # Reliability guard
    if "candidates" not in result:
        return {"feedback": f"Gemini API Error: {result}"}

    ai_text = result["candidates"][0]["content"]["parts"][0]["text"]

    return {"feedback": ai_text}
