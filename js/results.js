const params = new URLSearchParams(window.location.search);
const score = Number(params.get('score') || 0);
const total = Number(params.get('total') || 0);
const percent = Number(params.get('percent') || 0);
const feedback = params.get('feedback') || '';

const summaryEl = document.getElementById('summary');
const resultStatsEl = document.getElementById('resultStats');

summaryEl.textContent = `${score} out of ${total} correct — ${percent}%`; 

resultStatsEl.innerHTML = `
  <div class="stat"><strong>${score}</strong><br/>Correct</div>
  <div class="stat"><strong>${total - score}</strong><br/>Missed</div>
  <div class="stat"><strong>${percent}%</strong><br/>Accuracy</div>
  <div class="stat"><strong>${feedback}</strong><br/>Feedback</div>
`;
