// Light / Dark theme toggle
(function () {
  const defaultTheme = '{{ site.Params.theme.default | default `system`}}'
  const themes = ["light", "dark"];

  const themeToggleButtons = document.querySelectorAll(".hextra-theme-toggle");
  const themeToggleOptions = document.querySelectorAll(".hextra-theme-toggle-options p");

  function applyTheme(theme) {
    theme = themes.includes(theme) ? theme : "system";

    themeToggleButtons.forEach((btn) => btn.parentElement.dataset.theme = theme );

    localStorage.setItem("color-theme", theme);
  }

  function switchTheme(theme) {
    setTheme(theme);
    applyTheme(theme);
  }

  const colorTheme = "color-theme" in localStorage ? localStorage.getItem("color-theme") : defaultTheme;
  switchTheme(colorTheme);

  // Add click event handler to the menu items.
  themeToggleOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();

      switchTheme(option.dataset.item);
    })
  })

  // Add click event handler to the buttons
  themeToggleButtons.forEach((toggler) => {
    toggler.addEventListener("click", function (e) {
      e.preventDefault();

      // Toggle the dropdown menu
      const isOpen = toggler.dataset.state === "open";
      toggler.dataset.state = isOpen ? "closed" : "open";
      toggler.nextElementSibling.classList.toggle('hx:hidden');
    });
  });

  // Dismiss the menu when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target.closest('.hextra-theme-toggle') === null) {
      themeToggleButtons.forEach((toggler) => {
        toggler.dataset.state = 'closed';
        toggler.nextElementSibling.classList.add('hx:hidden');
      });
    }
  });

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("color-theme") === "system") {
      setTheme("system");
    }
  });
})();
