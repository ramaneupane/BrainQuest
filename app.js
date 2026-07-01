const questions = [
  {
    question: 'What planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
    answer: 'Mars'
  },
  {
    question: 'Which language runs in the browser?',
    options: ['Python', 'C++', 'JavaScript', 'Go'],
    answer: 'JavaScript'
  },
  {
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    answer: '7'
  }
];

let currentIndex = 0;
let score = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const statusEl = document.getElementById('status');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');

function showQuestion() {
  const current = questions[currentIndex];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = '';
  statusEl.textContent = 'Choose an answer.';
  nextBtn.classList.add('hidden');

  current.options.forEach((option) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(option));
    optionsEl.appendChild(button);
  });
}

function handleAnswer(selected) {
  const current = questions[currentIndex];
  const isCorrect = selected === current.answer;

  if (isCorrect) {
    score += 1;
    statusEl.textContent = 'Correct!';
  } else {
    statusEl.textContent = `Not quite. The answer is ${current.answer}.`;
  }

  updateScore();
  disableOptions();
  nextBtn.classList.remove('hidden');
}

function disableOptions() {
  [...optionsEl.children].forEach((button) => {
    button.disabled = true;
  });
}

function updateScore() {
  scoreEl.textContent = `Score: ${score}/${questions.length}`;
}

nextBtn.addEventListener('click', () => {
  currentIndex += 1;
  if (currentIndex >= questions.length) {
    questionEl.textContent = 'Quiz complete!';
    optionsEl.innerHTML = '';
    statusEl.textContent = `You scored ${score} out of ${questions.length}.`;
    nextBtn.classList.add('hidden');
    return;
  }
  showQuestion();
});

showQuestion();
updateScore();
