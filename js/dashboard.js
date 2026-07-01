const statsEl = document.getElementById('stats');
const historyListEl = document.getElementById('historyList');

function renderDashboard() {
  const results = getResults();
  const totalQuizzes = results.length;
  const highestScore = results.reduce((best, item) => (item.score > best ? item.score : best), 0);
  const averageScore = totalQuizzes
    ? Math.round(results.reduce((sum, item) => sum + item.percent, 0) / totalQuizzes)
    : 0;

  statsEl.innerHTML = `
    <div class="stat"><strong>${totalQuizzes}</strong><br/>Quizzes Taken</div>
    <div class="stat"><strong>${highestScore}</strong><br/>Highest Score</div>
    <div class="stat"><strong>${averageScore}%</strong><br/>Average Score</div>
    <div class="stat"><strong>${results[0]?.category || '—'}</strong><br/>Favorite Category</div>
  `;

  if (!results.length) {
    historyListEl.innerHTML = '<li>No quiz history yet.</li>';
    return;
  }

  historyListEl.innerHTML = results
    .slice(0, 8)
    .map((item) => `<li>${formatDate(item.date)} — ${item.category} · ${item.score}/${item.total} · ${item.percent}%</li>`)
    .join('');
}

renderDashboard();
