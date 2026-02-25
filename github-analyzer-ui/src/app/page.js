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
      <h1 style={{ marginBottom: 20 }}>GitHub Portfolio Analyzer</h1>

      <input
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
        placeholder="Enter GitHub URL"
        style={input}
      />

      <button onClick={analyzeProfile} style={button}>
        Analyze
      </button>

      {loading && <p style={{ marginTop: 20 }}>Analyzing profile...</p>}

      {result && (
        <div style={{ marginTop: 40 }}>
          {/* Recruiter Decision Banner */}
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

          {/* Portfolio Score */}
          <div style={card}>
            <h2>
              Portfolio Score:
              <span style={{ color: "#2563eb", marginLeft: 10 }}>
                {result.score.totalScore}
              </span>
            </h2>
          </div>

          {/* Score Breakdown */}
          <div style={card}>
            <h3>Engineering Signal Breakdown</h3>
            {Object.entries(result.score.breakdown).map(([k, v]) => (
              <p key={k}>
                {k}: <strong>{v}</strong>
              </p>
            ))}
          </div>

          {/* Weak Repositories */}
          <div style={card}>
            <h3>Repositories to Improve or Archive</h3>
            <ul>
              {result.score.weakRepositories.map((r, i) => (
                <li key={i}>
                  {r.name} — {r.issue}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Recruiter Evaluation */}
          {feedback && (
            <div style={card}>
              <h3>How Strong Is This Profile?</h3>
              <p>
                <strong>{feedback.profileStrength}</strong>
              </p>

              <h3>What Recruiters Notice First</h3>
              <ul>
                {feedback.recruiterFirstNotice?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3>Key Strengths</h3>
              <ul>
                {feedback.keyStrengths?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3>Projects to Improve</h3>
              <ul>
                {feedback.reposToImprove?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3>How to Make Projects More Impressive</h3>
              <ul>
                {feedback.howToImproveProjects?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h3>Clear Next Steps to Become Recruiter-Ready</h3>
              <ul>
                {feedback.nextSteps?.map((item, i) => (
                  <li key={i}>{item}</li>
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
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
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
