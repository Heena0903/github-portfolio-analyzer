function calculateScore(repos) {
  let score = 0;

  const readmeRepos = repos.filter((r) => r.has_readme);
  const readmeScore = Math.min(readmeRepos.length * 2, 20);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const starScore = Math.min(totalStars, 20);

  const describedRepos = repos.filter((r) => r.description);
  const descriptionScore = Math.min(describedRepos.length * 2, 20);

  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  const languageScore = Math.min(languages.size * 3, 20);

  const activeRepos = repos.filter((r) => {
    const lastPush = new Date(r.pushed_at);
    const diffDays = (Date.now() - lastPush) / (1000 * 60 * 60 * 24);
    return diffDays < 90;
  });

  const activityScore = Math.min(activeRepos.length * 2, 20);

  score =
    readmeScore + starScore + descriptionScore + languageScore + activityScore;

  return {
    totalScore: score,
    breakdown: {
      readmeScore,
      starScore,
      descriptionScore,
      languageScore,
      activityScore,
    },
  };
}

module.exports = calculateScore;
