const quizParams = new URLSearchParams(window.location.search);
const category = quizParams.get('category') || 'Mixed';
const difficulty = quizParams.get('difficulty') || 'Mixed';
const useTimer = quizParams.get('timer') === 'true';
const questionLimit = 20;

function normalizeCategory(value) {
  const trimmed = value?.toString().trim();
  if (!trimmed) return 'Mixed';

  const lower = trimmed.toLowerCase();
  if (lower === 'mixed' || lower === 'general knowledge' || lower === 'english') {
    return 'Mixed';
  }

  return trimmed;
}

function isCategoryMatch(itemCategory, selectedCategory) {
  if (selectedCategory === 'Mixed') return true;
  return normalizeCategory(itemCategory).toLowerCase() === normalizeCategory(selectedCategory).toLowerCase();
}

let questions = [];
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;
let timer = null;
let timeLeft = 30;
let usedQuestionIds = new Set();
let answers = [];

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const progressTextEl = document.getElementById('progressText');
const timerTextEl = document.getElementById('timerText');
const progressFillEl = document.getElementById('progressFill');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  saveTheme(theme);
}

async function loadQuestions() {
  const files = ['science', 'math', 'geography', 'history', 'sports', 'entertainment'];
  let allQuestions = [];

  try {
    for (const file of files) {
      const response = await fetch(`data/${file}.json`);
      if (!response.ok) {
        throw new Error(`Unable to load ${file}.json`);
      }
      const data = await response.json();
      allQuestions.push(...data);
    }
  } catch (error) {
    console.warn('Falling back to embedded quiz data.', error);
    allQuestions = Array.isArray(window.BRAINQUEST_QUESTIONS) ? window.BRAINQUEST_QUESTIONS : [];
  }

  if (allQuestions.length === 0) {
    questionEl.textContent = 'Quiz questions could not be loaded.';
    choicesEl.innerHTML = '';
    feedbackEl.textContent = 'Please refresh the page or try again later.';
    nextBtn.disabled = true;
    skipBtn.disabled = true;
    return;
  }

  const selectedCategory = normalizeCategory(category);
  let filtered = allQuestions;
  if (selectedCategory !== 'Mixed') {
    filtered = filtered.filter((item) => isCategoryMatch(item.category, selectedCategory));
  }
  if (difficulty !== 'Mixed') {
    filtered = filtered.filter((item) => item.difficulty === difficulty);
  }

  if (filtered.length === 0) {
    filtered = allQuestions;
  }

  questions = shuffleArray(filtered).slice(0, questionLimit);
  showQuestion();
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    finishQuiz();
    return;
  }

  const current = questions[currentIndex];
  selectedAnswer = null;
  answered = false;
  feedbackEl.textContent = '';
  nextBtn.textContent = 'Next';
  nextBtn.disabled = true;
  skipBtn.disabled = false;

  questionEl.textContent = current.question;
  choicesEl.innerHTML = '';
  const choices = shuffleArray(current.choices);
  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.addEventListener('click', () => selectAnswer(choice));
    choicesEl.appendChild(btn);
  });

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  progressFillEl.style.width = `${progressPercent}%`;
  progressTextEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;

  if (useTimer) {
    timeLeft = 30;
    timerTextEl.textContent = `Timer: ${timeLeft}s`;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      timeLeft -= 1;
      timerTextEl.textContent = `Timer: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        handleTimeout();
      }
    }, 1000);
  } else {
    timerTextEl.textContent = 'Timer: Off';
  }
}

function selectAnswer(choice) {
  if (answered) return;
  answered = true;
  selectedAnswer = choice;
  const current = questions[currentIndex];
  const buttons = choicesEl.querySelectorAll('.choice-btn');

  buttons.forEach((button) => {
    const text = button.textContent;
    button.classList.add('selected');
    if (text === current.correctAnswer) button.classList.add('correct');
    if (text === choice && text !== current.correctAnswer) button.classList.add('wrong');
  });

  const isCorrect = choice === current.correctAnswer;
  if (isCorrect) score += 1;
  answers.push({
    question: current.question,
    correctAnswer: current.correctAnswer,
    selectedAnswer: choice,
    explanation: current.explanation,
    isCorrect
  });
  feedbackEl.textContent = isCorrect ? 'Correct! Great job.' : `Not quite. ${current.explanation}`;
  nextBtn.disabled = false;
  skipBtn.disabled = true;
}

function handleTimeout() {
  const current = questions[currentIndex];
  answers.push({
    question: current.question,
    correctAnswer: current.correctAnswer,
    selectedAnswer: null,
    explanation: current.explanation,
    isCorrect: false
  });
  feedbackEl.textContent = `Time's up! The correct answer was ${current.correctAnswer}.`;
  nextBtn.disabled = false;
}

function nextQuestion() {
  if (!answered && !useTimer) {
    const current = questions[currentIndex];
    answers.push({
      question: current.question,
      correctAnswer: current.correctAnswer,
      selectedAnswer: null,
      explanation: current.explanation,
      isCorrect: false
    });
  }
  if (timer) clearInterval(timer);
  currentIndex += 1;
  showQuestion();
}

function finishQuiz() {
  if (timer) clearInterval(timer);
  const percent = Math.round((score / questions.length) * 100);
  const result = {
    category,
    difficulty,
    score,
    total: questions.length,
    percent,
    feedback: getFeedback(score, questions.length),
    date: new Date().toISOString()
  };
  saveResult(result);
  saveProgress([...getProgress(), result]);
  window.location.href = `results.html?score=${score}&total=${questions.length}&percent=${percent}&feedback=${encodeURIComponent(getFeedback(score, questions.length))}`;
}

nextBtn.addEventListener('click', nextQuestion);
skipBtn.addEventListener('click', () => {
  if (!answered) {
    const current = questions[currentIndex];
    answers.push({
      question: current.question,
      correctAnswer: current.correctAnswer,
      selectedAnswer: null,
      explanation: current.explanation,
      isCorrect: false
    });
  }
  if (timer) clearInterval(timer);
  currentIndex += 1;
  showQuestion();
});

themeToggle.addEventListener('click', () => {
  const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(theme);
});

const initialTheme = getTheme();
setTheme(initialTheme);
loadQuestions();
