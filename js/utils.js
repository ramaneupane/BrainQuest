function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getFeedback(score, total) {
  const pct = Math.round((score / total) * 100);
  if (pct >= 90) return 'Amazing work! You are a quiz superstar.';
  if (pct >= 70) return 'Great job! You are building strong knowledge.';
  if (pct >= 50) return 'Nice effort. Keep practicing and you will improve.';
  return 'You are getting started. Try another round to learn more.';
}

function getDifficultyLabel(difficulty) {
  return difficulty || 'Mixed';
}
