const categoryGridEl = document.getElementById('categoryGrid');
const searchInputEl = document.getElementById('searchInput');
const difficultyFilterEl = document.getElementById('difficultyFilter');

const categories = [
  { name: 'General Knowledge', difficulty: 'Mixed', icon: '🧠' },
  { name: 'Science', difficulty: 'Easy', icon: '🔬' },
  { name: 'Mathematics', difficulty: 'Medium', icon: '➗' },
  { name: 'English', difficulty: 'Mixed', icon: '📚' },
  { name: 'Computer Science', difficulty: 'Mixed', icon: '💻' },
  { name: 'Food & Nutrition', difficulty: 'Mixed', icon: '🍎' },
  { name: 'Countries', difficulty: 'Mixed', icon: '🌍' },
  { name: 'Animals', difficulty: 'Mixed', icon: '🐾' },
  { name: 'Mythology', difficulty: 'Mixed', icon: '🧚' },
  { name: 'Environment', difficulty: 'Mixed', icon: '🌿' },
  { name: 'Geography', difficulty: 'Easy', icon: '🗺️' },
  { name: 'History', difficulty: 'Medium', icon: '🏺' },
  { name: 'Sports', difficulty: 'Easy', icon: '🏅' },
  { name: 'Entertainment', difficulty: 'Easy', icon: '🎬' }
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
      <span class="category-icon">${category.icon}</span>
      <h3>${category.name}</h3>
      <p>${category.difficulty} difficulty</p>
    </a>
  `).join('');
}

searchInputEl.addEventListener('input', renderCategories);
difficultyFilterEl.addEventListener('change', renderCategories);
renderCategories();
