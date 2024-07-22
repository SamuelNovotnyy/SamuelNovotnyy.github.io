// DOM element selectors
const docBod = document.body
const topLogo = document.getElementById("top-logo");
const topLogo2 = document.getElementById("top-logo2");
const carouselShadow = document.getElementById("shg");
const langSel = document.querySelector(".selectionLang");
const themeSel = $("#themeButtons");

// Theme-related elements
const themeToggle = document.querySelectorAll("[data-theme-toggle]");
const sun = document.querySelectorAll(".fa-solid.fa-sun");
const moon = document.querySelectorAll(".fa-solid.fa-moon");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

// Language-related elements
const langContainer = document.querySelector(".container-lang");
const subLangMenu = document.querySelector(".sub-lang-menu");
const selectedLangDisplay = document.querySelector(".selected-lang-display");
const selectLang = Array.from(document.querySelectorAll("[data-lang-toggle]"));
const selection = Array.from(document.querySelectorAll("[id='inputselect']"));

// Sidebar-related elements
const sidebar = document.querySelector("#skeleton-sidebar-cont");
const topBar = document.querySelector("#skeleton-head")
const sidebarToggleButton = document.querySelector("#mobile-menu-icon-cont");
const icons = sidebarToggleButton.children;

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
  sliderToggle(theme);
  for (let i = 0; i < moon.length; i++) {
    moon[i].style.display = theme === "dark" ? "none" : "inline-block";
    sun[i].style.display = theme === "dark" ? "inline-block" : "none";
  }
}

// Language functions
function calculateSettingAsLangString() {
  return localStorage.getItem("lang") || "en";
}

function updateLangOnHtmlEl(lang) {
  document.documentElement.setAttribute("lang", lang);
  selectLang[0].value = lang;
}

async function fetchTranslationsFor(newLocale) {
  const currentPath = window.location.pathname;
  const isIndexPage = currentPath.endsWith("index.html") || currentPath === "/";
  const langPath = isIndexPage
    ? `lang/${newLocale}.json`
    : `../lang/${newLocale}.json`;

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

// Sidebar toggle
function sidebarToggle() {
  docBod.classList.toggle("noscroll");
  sidebar.classList.toggle("hide-sidebar");
  topBar.classList.toggle("fixed");
  for (var i = 0; i < icons.length; i++) {
    icons[i].classList.toggle("hide-icon");
  }
}

function sliderToggle(theme) {
  const slider = $('#mobile-slider');

  if (theme === "dark") {
    slider[0].classList.add("slider-move");
  } else {
    slider[0].classList.remove("slider-move");
  }
}


// Event listeners
for (var i = 0; i < themeToggle.length; i++) {
  themeToggle[i].addEventListener("click", () => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    updateThemeOnHtmlEl(newTheme);
    currentThemeSetting = newTheme;
  });
}

selectLang[0].addEventListener("change", () => {
  let newLang = selectLang[0].value;

  localStorage.setItem("lang", newLang);
  updateLangOnHtmlEl(newLang);

  currentLangSetting = newLang;
  setLocale(currentLangSetting);
});

// Language menu hover effects
langContainer.addEventListener(
  "mouseover",
  () => (subLangMenu.style.display = "block")
);
subLangMenu.addEventListener(
  "mouseover",
  () => (subLangMenu.style.display = "block")
);
langContainer.addEventListener(
  "mouseout",
  () => (subLangMenu.style.display = "none")
);
subLangMenu.addEventListener(
  "mouseout",
  () => (subLangMenu.style.display = "none")
);

subLangMenu.addEventListener("click", async function (event) {
  if (event.target.tagName === "LI") {
    // Get the language code from the li's data attribute
    const newLang = event.target.getAttribute("data-lang-code");

    //initiate only on change
    if (newLang != localStorage.getItem("lang")) {
      // Close the menu by hiding it
      subLangMenu.style.display = "none";

      // Update the language setting
      localStorage.setItem("lang", newLang);
      updateLangOnHtmlEl(newLang);
      currentLangSetting = newLang;

      // Fetch new translations and update the page
      await setLocale(currentLangSetting);

      // Update any language selection dropdowns
      document.querySelectorAll("[data-i18n-key]").forEach((toggle) => {
        toggle.value = newLang;
      });
    }
  }
});

// Initialize
setLocale(currentLangSetting);
updateThemeOnHtmlEl(currentThemeSetting);
updateLangOnHtmlEl(currentLangSetting);