const axios = require("axios");

async function calculateScore(username, repos) {
  let weakRepos = [];

  const documented = repos.filter((r) => r.description);
  const descriptionScore = Math.min(documented.length * 4, 20);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const impactScore = Math.min(totalStars, 20);

  let activityScore = 0;

  repos.forEach((repo) => {
    const lastPush = new Date(repo.pushed_at);
    const diffDays = (Date.now() - lastPush) / (1000 * 60 * 60 * 24);

    if (diffDays < 120) activityScore += 4;

    if (diffDays > 180) {
      weakRepos.push({
        name: repo.name,
        issue: "Inactive (>6 months)",
      });
    }
  });

  activityScore = Math.min(activityScore, 20);

  let documentationScore = 0;
  let structureScore = 0;

  const topRepos = repos.slice(0, 5);

  for (const repo of topRepos) {
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/contents`,
      );

      const files = res.data.map((f) => f.name.toLowerCase());

      if (files.includes("readme.md")) {
        documentationScore += 4;
      } else {
        weakRepos.push({
          name: repo.name,
          issue: "Missing README",
        });
      }

      if (files.includes("src")) structureScore += 3;

      if (
        files.includes("package.json") ||
        files.includes("requirements.txt")
      ) {
        structureScore += 3;
      }
    } catch {}
  }

  documentationScore = Math.min(documentationScore, 20);
  structureScore = Math.min(structureScore, 20);

  const totalScore =
    documentationScore +
    descriptionScore +
    impactScore +
    activityScore +
    structureScore;

  return {
    totalScore,
    breakdown: {
      documentationScore,
      descriptionScore,
      impactScore,
      activityScore,
      structureScore,
    },
    weakRepositories: weakRepos.slice(0, 5),
  };
}

module.exports = calculateScore;
