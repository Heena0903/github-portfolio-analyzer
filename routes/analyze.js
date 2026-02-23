const express = require("express");
const axios = require("axios");
const calculateScore = require("../utils/scoreCalculator");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl || !githubUrl.includes("github.com")) {
      return res.status(400).json({ message: "Invalid GitHub URL" });
    }

    const username = githubUrl.split("github.com/")[1].replace("/", "").trim();

    // Fetch profile
    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`,
    );

    // Fetch repos
    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`,
    );

    // Calculate engineering score
    const scoring = await calculateScore(username, repoResponse.data);

    // Call AI FastAPI service
    const aiResponse = await axios.post(
      "https://github-ai-service.onrender.com/generate-feedback",
      { metrics: scoring },
    );

    res.json({
      user: userResponse.data,
      score: scoring,
      aiFeedback: aiResponse.data.feedback,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Error analyzing GitHub profile" });
  }
});

module.exports = router;
