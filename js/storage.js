const STORAGE_KEYS = {
  progress: 'brainquest-progress',
  results: 'brainquest-results',
  theme: 'brainquest-theme'
};

function loadStoredData(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn('Could not parse local storage value', error);
    return fallback;
  }
}

function saveStoredData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getProgress() {
  return loadStoredData(STORAGE_KEYS.progress, []);
}

function saveProgress(progress) {
  saveStoredData(STORAGE_KEYS.progress, progress);
}

function getResults() {
  return loadStoredData(STORAGE_KEYS.results, []);
}

function saveResult(result) {
  const results = getResults();
  results.unshift(result);
  saveStoredData(STORAGE_KEYS.results, results.slice(0, 20));
}

function getTheme() {
  return loadStoredData(STORAGE_KEYS.theme, 'light');
}

function saveTheme(theme) {
  saveStoredData(STORAGE_KEYS.theme, theme);
}
