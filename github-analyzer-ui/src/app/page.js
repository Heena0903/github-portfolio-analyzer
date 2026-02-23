"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [githubUrl, setGithubUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://github-portfolio-analyzer-vnen.onrender.com/api/analyze",
        { githubUrl },
      );

      setResult(res.data);
    } catch (err) {
      alert("Error analyzing profile");
    } finally {
      setLoading(false);
    }
  };

  let feedback = null;
  try {
    feedback = result?.aiFeedback
      ? JSON.parse(result.aiFeedback.replace(/```json|```/g, ""))
      : null;
  } catch {}

  return (
    <div style={page}>
      <h1>GitHub Portfolio Analyzer</h1>

      <input
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
        placeholder="Enter GitHub URL"
        style={input}
      />

      <button onClick={analyzeProfile} style={button}>
        Analyze
      </button>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div style={{ marginTop: 40 }}>
          {feedback && (
            <div
              style={{
                ...banner,
                backgroundColor:
                  feedback.hiringSignal === "Strong Hire"
                    ? "#16a34a"
                    : feedback.hiringSignal === "Hire"
                      ? "#2563eb"
                      : feedback.hiringSignal === "Consider"
                        ? "#f59e0b"
                        : "#dc2626",
              }}
            >
              Recruiter Decision: {feedback.hiringSignal}
            </div>
          )}

          <div style={card}>
            <h2>Portfolio Score: {result.score.totalScore}</h2>
          </div>

          <div style={card}>
            <h3>Score Breakdown</h3>
            {Object.entries(result.score.breakdown).map(([k, v]) => (
              <p key={k}>
                {k}: {v}
              </p>
            ))}
          </div>

          <div style={card}>
            <h3>Repositories to Improve</h3>
            <ul>
              {result.score.weakRepositories.map((r, i) => (
                <li key={i}>
                  {r.name} — {r.issue}
                </li>
              ))}
            </ul>
          </div>

          {feedback && (
            <div style={card}>
              <h3>Key Strengths</h3>
              <ul>
                {feedback.strengths?.slice(0, 5).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <h3>Actionable Improvements</h3>
              <ul>
                {feedback.improvements?.slice(0, 5).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const page = {
  padding: 40,
  background: "#0f172a",
  minHeight: "100vh",
  color: "white",
};

const banner = {
  padding: 18,
  borderRadius: 12,
  fontSize: 20,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 24,
};

const card = {
  background: "white",
  color: "#111",
  padding: 24,
  borderRadius: 14,
  marginBottom: 24,
};

const input = {
  padding: 12,
  width: 420,
  borderRadius: 8,
  border: "none",
};

const button = {
  marginLeft: 10,
  padding: "12px 20px",
  borderRadius: 8,
  background: "#2563eb",
  color: "white",
  border: "none",
};
