// DOM element selectors
const topLogo = document.getElementById("top-logo");
const topLogo2 = document.getElementById("top-logo2");
const carouselShadow = document.getElementById("shg");
const langSel = document.querySelector(".selectionLang");
const themeSel = $('#themeButtons');

// Theme-related elements
const themeToggle = document.querySelector("[data-theme-toggle]");
const sun = document.querySelector(".fa-solid.fa-sun");
const moon = document.querySelector(".fa-solid.fa-moon");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

// Language-related elements
const langContainer = document.querySelector(".container-lang");
const subLangMenu = document.querySelector(".sub-lang-menu");
const selectedLangDisplay = document.querySelector('.selected-lang-display');

// Sidebar-related elements
const sidebar = document.querySelector("#skeleton-sidebar-cont");
const sidebarToggleButton = document.querySelector("#mobile-menu-icon-cont");

// Theme and language settings
let currentThemeSetting = calculateSettingAsThemeString();
let currentLangSetting = calculateSettingAsLangString();
let translations = {};
let locale;

// Theme functions
function calculateSettingAsThemeString() {
  const localStorageTheme = localStorage.getItem("theme");
  return localStorageTheme || (systemSettingDark.matches ? "dark" : "light");
}

function updateThemeOnHtmlEl(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  moon.style.display = theme === "dark" ? "none" : "inline-block";
  sun.style.display = theme === "dark" ? "inline-block" : "none";
}

// Language functions
function calculateSettingAsLangString() {
  return localStorage.getItem("lang") || "en";
}

function updateLangOnHtmlEl(lang) {
  document.documentElement.setAttribute("lang", lang);
}

async function fetchTranslationsFor(newLocale) {
  const currentPath = window.location.pathname;
  const isIndexPage = currentPath.endsWith('index.html') || currentPath === '/';
  const langPath = isIndexPage ? `lang/${newLocale}.json` : `../lang/${newLocale}.json`;

  const response = await fetch(langPath);
  return response.json();
}

async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations = await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;
  translatePage();
}

function translatePage() {
  document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
}

function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");
  element.innerHTML = translations[key];
}

// Event listeners
themeToggle.addEventListener("click", () => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  updateThemeOnHtmlEl(newTheme);
  currentThemeSetting = newTheme;
});

// Language menu hover effects
langContainer.addEventListener("mouseover", () => subLangMenu.style.display = "block");
subLangMenu.addEventListener("mouseover", () => subLangMenu.style.display = "block");
langContainer.addEventListener("mouseout", () => subLangMenu.style.display = "none");
subLangMenu.addEventListener("mouseout", () => subLangMenu.style.display = "none");

subLangMenu.addEventListener('click', async function(event) {
  if (event.target.tagName === 'LI') {
    // Get the language code from the li's data attribute
    const newLang = event.target.getAttribute('data-lang-code');
    
    //initiate only on change
    if (newLang != localStorage.getItem("lang")) {
      // Close the menu by hiding it
      subLangMenu.style.display = 'none';

      // Update the language setting
      localStorage.setItem("lang", newLang);
      updateLangOnHtmlEl(newLang);
      currentLangSetting = newLang;
      
      // Fetch new translations and update the page
      await setLocale(currentLangSetting);

      // Update any language selection dropdowns
      document.querySelectorAll("[data-i18n-key]").forEach(toggle => {
      toggle.value = newLang;
      });
    }
  }
});

sidebarToggleButton.addEventListener("click", () => {
  const body = document.body;
  const icons = sidebarToggleButton.children;

  body.classList.toggle('noscroll');
  sidebar.classList.toggle('hidden');
  for (var i = 0; i < icons.length; i++) {
    icons[i].classList.toggle('hide-icon');
  }
});

// Initialize
setLocale(currentLangSetting);
updateThemeOnHtmlEl(currentThemeSetting);
updateLangOnHtmlEl(currentLangSetting);