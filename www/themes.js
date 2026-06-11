(function () {
  const STORAGE_KEY = "brevet2026-theme";
  const DEFAULT = "noir";

  const THEMES = [
    { id: "noir", name: "Noir", desc: "Sombre & chaud", swatches: ["#0F0E0D", "#F59E0B", "#6EE7B7"] },
    { id: "carnet", name: "Carnet", desc: "Clair & papier", swatches: ["#F4EFE6", "#C45C26", "#2D6A4F"] },
    { id: "ocean", name: "Océan", desc: "Bleu profond", swatches: ["#0A1628", "#22D3EE", "#60A5FA"] },
    { id: "foret", name: "Forêt", desc: "Vert nature", swatches: ["#0D1A14", "#34D399", "#A3E635"] },
    { id: "sunset", name: "Sunset", desc: "Rose & or", swatches: ["#1A0F18", "#FB7185", "#FBBF24"] },
    { id: "lavande", name: "Lavande", desc: "Violet doux", swatches: ["#14101F", "#A78BFA", "#E879F9"] },
    { id: "minuit", name: "Minuit", desc: "Indigo & or", swatches: ["#08080C", "#818CF8", "#FCD34D"] }
  ];

  function isLightTheme(id) {
    return id === "carnet";
  }

  function applyTheme(id) {
    const theme = THEMES.find(t => t.id === id) ? id : DEFAULT;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const root = getComputedStyle(document.documentElement);
      meta.content = root.getPropertyValue("--meta-theme").trim() || "#0F0E0D";
    }

    document.querySelectorAll(".theme-card").forEach(card => {
      card.classList.toggle("theme-card--active", card.dataset.theme === theme);
    });

    if (typeof window.syncNativeTheme === "function") {
      window.syncNativeTheme(theme);
    }
  }

  function renderThemeGrid() {
    const grid = document.getElementById("themeGrid");
    if (!grid) return;
    const current = localStorage.getItem(STORAGE_KEY) || DEFAULT;
    grid.innerHTML = THEMES.map(t => `
      <button class="theme-card${t.id === current ? " theme-card--active" : ""}" type="button" data-theme="${t.id}">
        <span class="theme-swatches">
          ${t.swatches.map(c => `<i style="background:${c}"></i>`).join("")}
        </span>
        <span class="theme-name">${t.name}</span>
        <span class="theme-desc">${t.desc}</span>
      </button>
    `).join("");
    grid.querySelectorAll(".theme-card").forEach(btn => {
      btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
    });
  }

  window.initThemes = function () {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT;
    applyTheme(saved);
    renderThemeGrid();
  };
})();
