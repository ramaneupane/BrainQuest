const themeToggle = document.getElementById('themeToggle');

function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  saveTheme(theme);
}

const initialTheme = getTheme();
setTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(theme);
});
