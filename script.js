// Mobile menu, theme switcher + footer year
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("menuBtn");
  var nav = document.getElementById("mobileNav");

  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  var savedTheme = localStorage.getItem("rajmudra-theme");
  var theme = savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", theme);

  function updateThemeButtons() {
    var isLight = document.documentElement.getAttribute("data-theme") === "light";
    document.querySelectorAll(".theme-toggle").forEach(function (button) {
      button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      button.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
    });
  }

  document.querySelectorAll(".theme-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") || "dark";
      var next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("rajmudra-theme", next);
      updateThemeButtons();
    });
  });

  updateThemeButtons();

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
