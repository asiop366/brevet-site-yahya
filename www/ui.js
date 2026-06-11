(function () {
  const viewMap = {
    home: "view-home",
    quiz: "view-quiz",
    plan: "view-plan",
    info: "view-info"
  };

  window.showView = function (name) {
    Object.values(viewMap).forEach((id) => {
      document.getElementById(id).classList.remove("view--active");
    });
    document.getElementById(viewMap[name]).classList.add("view--active");
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.toggle("tab--active", tab.dataset.view === name);
    });
  };

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => showView(tab.dataset.view));
  });

  document.getElementById("startQuiz").addEventListener("click", () => showView("quiz"));

  document.getElementById("quizBack").addEventListener("click", () => {
    if (typeof window.exitQuizSession === "function") window.exitQuizSession();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
