const categoryGridEl = document.getElementById('categoryGrid');
const searchInputEl = document.getElementById('searchInput');
const difficultyFilterEl = document.getElementById('difficultyFilter');

const categories = [
  { name: 'General Knowledge', difficulty: 'Mixed' },
  { name: 'Science', difficulty: 'Easy' },
  { name: 'Mathematics', difficulty: 'Medium' },
  { name: 'English', difficulty: 'Mixed' },
  { name: 'Computer Science', difficulty: 'Mixed' },
  { name: 'Food & Nutrition', difficulty: 'Mixed' },
  { name: 'Countries', difficulty: 'Mixed' },
  { name: 'Animals', difficulty: 'Mixed' },
  { name: 'Mythology', difficulty: 'Mixed' },
  { name: 'Environment', difficulty: 'Mixed' },
  { name: 'Geography', difficulty: 'Easy' },
  { name: 'History', difficulty: 'Medium' },
  { name: 'Sports', difficulty: 'Easy' },
  { name: 'Entertainment', difficulty: 'Easy' }
];

function renderCategories() {
  const search = searchInputEl.value.toLowerCase();
  const difficulty = difficultyFilterEl.value;
  const filtered = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(search);
    const matchesDifficulty = difficulty === 'all' || category.difficulty === difficulty || category.difficulty === 'Mixed';
    return matchesSearch && matchesDifficulty;
  });

  categoryGridEl.innerHTML = filtered.map((category) => `
    <a class="category-card" href="quiz.html?category=${encodeURIComponent(category.name)}&difficulty=Mixed&timer=false">
      <h3>${category.name}</h3>
      <p>${category.difficulty} difficulty</p>
    </a>
  `).join('');
}

searchInputEl.addEventListener('input', renderCategories);
difficultyFilterEl.addEventListener('change', renderCategories);
renderCategories();
