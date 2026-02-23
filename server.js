const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");

const app = express();

// CORS (allow Vercel frontend)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("GitHub Portfolio Analyzer Backend Running 🚀");
});

// API route
app.use("/api", analyzeRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
