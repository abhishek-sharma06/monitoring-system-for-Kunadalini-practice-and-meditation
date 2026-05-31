// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme on page load
function initializeTheme() {
  // Check localStorage for saved preference
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
}

// Set theme
function setTheme(theme) {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
}

// Update theme icon
function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    themeToggle.title = 'Switch to Light Mode';
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    themeToggle.title = 'Switch to Dark Mode';
  }
}

// Toggle theme on button click
themeToggle.addEventListener('click', function () {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Open component in new tab or modal
function openComponent(url, checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  if (checkbox.checked) {
    window.open(url, '_blank');
  } else {
    document.getElementById('fullViewFrame').src = url;
    document.getElementById('fullViewTitle').textContent = 'Full View Preview';
    new bootstrap.Modal(document.getElementById('fullViewModal')).show();
  }
}

// Set footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  initializeTheme();
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});
