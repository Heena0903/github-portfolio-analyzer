const express = require("express");
const axios = require("axios");
const calculateScore = require("../utils/scoreCalculator");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { githubUrl } = req.body;

    const username = githubUrl.split("github.com/")[1].replace("/", "");

    // Fetch GitHub profile
    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`,
    );

    // Fetch repositories
    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,
    );

    // Calculate score (FIXED)
    const scoring = await calculateScore(username, repoResponse.data);

    // Call Python AI service
    const aiResponse = await axios.post(
      "https://github-ai-service.onrender.com/generate-feedback",
      { metrics: scoring },
    );

    const aiFeedback = aiResponse.data.feedback;

    res.json({
      user: userResponse.data,
      repos: repoResponse.data,
      score: scoring,
      aiFeedback: aiFeedback,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Error analyzing GitHub profile" });
  }
});

module.exports = router;
