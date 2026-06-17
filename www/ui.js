(function () {
  function syncViewportHeight() {
    const vh = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty("--app-h", `${Math.round(vh)}px`);
  }

  syncViewportHeight();
  window.addEventListener("resize", syncViewportHeight, { passive: true });
  window.visualViewport?.addEventListener("resize", syncViewportHeight, { passive: true });
  window.visualViewport?.addEventListener("scroll", syncViewportHeight, { passive: true });

  const viewMap = {
    home: "view-home",
    quiz: "view-quiz",
    fiches: "view-fiches",
    plan: "view-plan",
    info: "view-info",
    settings: "view-settings"
  };

  window.showView = function (name) {
    Object.values(viewMap).forEach((id) => {
      document.getElementById(id).classList.remove("view--active", "view--enter", "view--entered");
    });
    const next = document.getElementById(viewMap[name]);
    next.classList.add("view--active", "view--enter");
    requestAnimationFrame(() => next.classList.add("view--entered"));
    document.querySelectorAll(".dock-item").forEach((item) => {
      item.classList.toggle("dock-item--active", item.dataset.view === name);
    });
    if (name === "quiz" && typeof window.refreshQuizBrowse === "function") {
      window.refreshQuizBrowse();
    }
  };

  document.querySelectorAll(".dock-item").forEach((item) => {
    item.addEventListener("click", () => showView(item.dataset.view));
  });

  document.getElementById("startQuiz").addEventListener("click", () => showView("quiz"));

  document.getElementById("quizBack").addEventListener("click", () => {
    if (typeof window.exitQuizSession === "function") window.exitQuizSession();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "v" && event.key !== "V") return;
    const target = event.target;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
    const homeActive = document.getElementById("view-home").classList.contains("view--active");
    const quizHidden = document.getElementById("quizSession").hidden;
    if (homeActive && quizHidden && typeof window.enterUltimateSession === "function") {
      event.preventDefault();
      window.enterUltimateSession();
    }
  });

  if (typeof window.initThemes === "function") window.initThemes();
  if (typeof window.initFiches === "function") window.initFiches();

  if ("serviceWorker" in navigator && !window.Capacitor?.isNativePlatform?.()) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  requestAnimationFrame(() => {
    document.getElementById("view-home")?.classList.add("view--entered");
  });
})();
