const axios = require("axios");

async function calculateScore(username, repos) {
  let weakRepos = [];

  // Description clarity
  const describedRepos = repos.filter((r) => r.description);
  const descriptionScore = Math.min(describedRepos.length * 4, 20);

  // Impact (stars)
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const impactScore = Math.min(totalStars, 20);

  // Activity
  let activityScore = 0;

  repos.forEach((repo) => {
    const lastPush = new Date(repo.pushed_at);
    const diffDays = (Date.now() - lastPush) / (1000 * 60 * 60 * 24);

    if (diffDays < 120) activityScore += 4;

    if (diffDays > 180) {
      weakRepos.push({
        name: repo.name,
        issue: "Inactive repository (>6 months)",
      });
    }
  });

  activityScore = Math.min(activityScore, 20);

  // Structure + README check (top 5 repos)
  let structureScore = 0;
  let documentationScore = 0;

  const reposToCheck = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  for (const repo of reposToCheck) {
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/contents`,
      );

      const files = res.data.map((f) => f.name.toLowerCase());

      // README check
      if (files.includes("readme.md")) {
        documentationScore += 4;
      } else {
        weakRepos.push({ name: repo.name, issue: "Missing README" });
      }

      // Folder structure signals
      if (files.includes("src")) structureScore += 3;

      if (
        files.includes("package.json") ||
        files.includes("requirements.txt")
      ) {
        structureScore += 3;
      }
    } catch (err) {
      // Ignore API failures safely
      continue;
    }
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
