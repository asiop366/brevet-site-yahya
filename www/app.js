    const EXAM_DATE = new Date(2026, 5, 18, 8, 0, 0);
    const DAY = 24 * 60 * 60 * 1000;
    const STORAGE_KEY = "brevet2026-engine-state";
    const LETTERS = ["A", "B", "C", "D"];

    const subjects = [
      { id: "mix", label: "Mix" },
      { id: "maths", label: "Maths" },
      { id: "francais", label: "Français" },
      { id: "histoire", label: "Histoire-Géo" },
      { id: "emc", label: "EMC" },
      { id: "sciences", label: "Sciences" }
    ];

    const priorities = [
      { subject: "Maths", topic: "Automatismes 2026", score: 96, color: "var(--maths)", why: "Partie dédiée de 20 minutes sans calculatrice, présente chaque année depuis 2021.", likely: "Automatismes, Pythagore, Thalès, trigonométrie, pourcentages, fractions, fonctions, probabilités, statistiques" },
      { subject: "Français", topic: "Compréhension + grammaire", score: 92, color: "var(--francais)", why: "Épreuve centrale du brevet : toujours un texte + questions de langue.", likely: "Compréhension, homophones, accords, valeurs des temps, réécriture, argumentation, conjugaison, figures de style" },
      { subject: "Histoire", topic: "WW2 / Guerre froide", score: 88, color: "var(--histoire)", why: "Les repères chronologiques reviennent chaque année aux annales DNB.", likely: "WW2, 18 juin 1940, débarquement, 8 mai 1945, Vichy, guerre froide, mur de Berlin, chronologie" },
      { subject: "Géographie", topic: "France productive et aménagée", score: 84, color: "var(--sciences)", why: "Thème récurrent : territoires français, inégalités, aménagement.", likely: "Espaces productifs, aires urbaines, métropolisation, aménagement, mobilités, DROM, croquis simple" },
      { subject: "EMC", topic: "Citoyenneté / laïcité", score: 80, color: "var(--emc)", why: "Situation concrète à analyser avec les valeurs de la République.", likely: "Laïcité, citoyenneté, démocratie, droits & devoirs, discrimination, institutions, engagement" },
      { subject: "Sciences", topic: "SVT + Physique 2026", score: 85, color: "var(--sciences)", why: "Épreuve 2026 : SVT et physique-chimie (30 min chacune).", likely: "SVT : climat, immunité, génétique, pathogènes · Physique : vitesse, Ohm, énergie, conservation de la masse" }
    ];

    const DAILY_QUESTION_COUNT = 45;
    const ULTIMATE_QUESTION_COUNT = 100;
    const SUBJECT_QUESTION_COUNT = 40;
    const ALL_SUBJECTS = ["maths", "francais", "histoire", "emc", "sciences"];

    const plan = [
      { date: "11", label: "Aujourd'hui", work: "Maths auto + WW2", tone: "normal", subjects: ["maths", "histoire"] },
      { date: "12", label: "Vendredi", work: "Français + EMC", tone: "normal", subjects: ["francais", "emc"] },
      { date: "13", label: "Samedi", work: "Géo France + sciences", tone: "normal", subjects: ["histoire", "sciences"] },
      { date: "14", label: "Dimanche", work: "Annales courtes", tone: "normal", subjects: ["maths", "francais", "histoire", "emc", "sciences"] },
      { date: "15", label: "Lundi", work: "Maths problèmes", tone: "normal", subjects: ["maths"] },
      { date: "16", label: "Mardi", work: "Rédaction + repères", tone: "normal", subjects: ["francais", "histoire"] },
      { date: "17", label: "Mercredi", work: "Dates + matériel", tone: "normal", subjects: ["histoire"] },
      { date: "18", label: "Jeudi", work: "Brevet", tone: "exam", subjects: [] }
    ];

    const SUBJECT_ICONS = { mix: "🎯", maths: "📐", francais: "📖", histoire: "🌍", emc: "⚖️", sciences: "🔬" };
    const SUBJECT_LIKELY = {
      mix: "Toutes les matières du brevet",
      maths: "Auto, Pythagore, Thalès, %, fractions, fonctions, probas",
      francais: "Texte, homophones, accords, temps, réécriture, argumentation",
      histoire: "WW2, dates clés, guerre froide, géo France & territoires",
      emc: "Laïcité, citoyenneté, droits, institutions, situations",
      sciences: "Climat, immunité, génétique · vitesse, Ohm, énergie"
    };
    const SUBJECT_PROB = {
      maths: 96,
      francais: 92,
      histoire: 88,
      emc: 80,
      sciences: 85
    };
    const BANK_SIZE = window.QuestionBank?.BANK_SIZE || 500;

    const state = loadState();
    let currentQuestion = null;
    let activeSubject = "mix";
    let sessionCount = 0;
    let sessionMode = "free";
    let sessionReturnView = "view-quiz";
    let queue = [];
    let queueIndex = 0;
    let queueTotal = 0;
    let queueCorrect = 0;
    let queueSummaryShown = false;
    let queueSummaryTitle = "Bilan";

    function loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        return {
          answered: saved.answered || 0,
          correct: saved.correct || 0,
          streak: saved.streak || 0,
          seen: Array.isArray(saved.seen) ? saved.seen.slice(-4000) : [],
          seenBySubject: saved.seenBySubject && typeof saved.seenBySubject === "object" ? saved.seenBySubject : {}
        };
      } catch {
        return { answered: 0, correct: 0, streak: 0, seen: [], seenBySubject: {} };
      }
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Le site doit rester utilisable même si le stockage local est bloqué.
      }
    }

    function isQueuedMode() {
      return sessionMode === "daily" || sessionMode === "ultimate" || sessionMode === "subject";
    }

    function getTodayPlan() {
      const today = new Date().getDate();
      return plan.find(d => Number(d.date) === today) || plan.find(d => d.tone !== "exam") || plan[0];
    }

    function subjectIdFromQuestion(question) {
      const map = {
        Maths: "maths",
        Français: "francais",
        "Histoire-Géo": question.topic === "Géographie" ? "histoire" : "histoire",
        EMC: "emc",
        Sciences: "sciences"
      };
      return map[question.subject] || "mix";
    }

    function getSubjectDisplayName(question) {
      if (question.topic === "Géographie") return "Géographie";
      if (question.topic === "Physique") return "Physique";
      if (question.topic === "SVT") return "SVT";
      const map = {
        Maths: "Maths",
        Français: "Français",
        "Histoire-Géo": "Histoire",
        EMC: "EMC",
        Sciences: "Sciences"
      };
      return map[question.subject] || question.subject;
    }

    function getSubjectBannerClass(question) {
      if (question.topic === "Géographie") return "quiz-subject-pill--geo";
      if (question.topic === "Physique") return "quiz-subject-pill--physique";
      if (question.topic === "SVT") return "quiz-subject-pill--svt";
      const map = {
        Maths: "quiz-subject-pill--maths",
        Français: "quiz-subject-pill--francais",
        "Histoire-Géo": "quiz-subject-pill--histoire",
        EMC: "quiz-subject-pill--emc",
        Sciences: "quiz-subject-pill--sciences"
      };
      return map[question.subject] || "quiz-subject-pill--mix";
    }

    function formatSubjectList(subjectIds) {
      const labels = {
        maths: "Maths",
        francais: "Français",
        histoire: "Histoire",
        emc: "EMC",
        sciences: "Sciences"
      };
      return subjectIds.map(id => labels[id] || id).join(" · ");
    }

    function updateHomeDaily() {
      const todayPlan = getTodayPlan();
      const card = document.getElementById("dailyCard");
      const btn = document.getElementById("startDaily");
      document.getElementById("dailyPlanWork").textContent = todayPlan.work;
      document.getElementById("dailyPlanDate").textContent = `${todayPlan.date} juin · ${todayPlan.label}`;
      const subjects = todayPlan.subjects?.length ? todayPlan.subjects : ["mix"];
      document.getElementById("dailySubjectList").textContent = formatSubjectList(subjects);
      document.getElementById("dailyPlanMeta").textContent =
        `${DAILY_QUESTION_COUNT} questions aléatoires · ${formatSubjectList(subjects)}`;
      card.classList.toggle("action-tile--exam", todayPlan.tone === "exam");
      btn.disabled = todayPlan.tone === "exam";
    }

    function buildQueue(count, subjectIds) {
      const ids = subjectIds?.length ? subjectIds : ALL_SUBJECTS;
      const exclude = new Set(state.seen);
      const items = window.QuestionBank.pickQuestions(ids, count, exclude);
      const sessionSeen = new Set();

      items.forEach((question) => {
        sessionSeen.add(question.id);
        if (!state.seen.includes(question.id)) {
          state.seen.push(question.id);
        }
        const subj = question.bankSubject || subjectIdFromQuestion(question);
        if (!state.seenBySubject[subj]) state.seenBySubject[subj] = [];
        if (!state.seenBySubject[subj].includes(question.id)) {
          state.seenBySubject[subj].push(question.id);
        }
      });

      state.seen = state.seen.slice(-4000);
      Object.keys(state.seenBySubject).forEach((key) => {
        state.seenBySubject[key] = state.seenBySubject[key].slice(-BANK_SIZE);
      });
      saveState();
      return items;
    }

    function getSubjectProgress(subjectId) {
      const seen = state.seenBySubject[subjectId]?.length || 0;
      const total = window.QuestionBank?.banks?.[subjectId]?.length || BANK_SIZE;
      return { seen, total, pct: total ? Math.round(seen / total * 100) : 0 };
    }

    function enterQueuedSession(mode, subjectIds, count, returnView, summaryTitle) {
      sessionMode = mode;
      sessionReturnView = returnView;
      queue = buildQueue(count, subjectIds);
      queueIndex = 0;
      queueTotal = count;
      queueCorrect = 0;
      queueSummaryShown = false;
      queueSummaryTitle = summaryTitle;
      sessionCount = 0;

      document.getElementById("app").classList.add("app--quiz");
      document.getElementById("quizSession").hidden = false;
      document.getElementById("quizSession").classList.remove("quiz-session--in");
      void document.getElementById("quizSession").offsetWidth;
      document.getElementById("quizSession").classList.add("quiz-session--in");
      document.querySelectorAll(".view").forEach(v => v.classList.remove("view--active"));
      document.getElementById("nextQuestion").textContent = "Suivant";
      showQueuedQuestion();
    }

    function enterDailySession() {
      const todayPlan = getTodayPlan();
      if (todayPlan.tone === "exam") return;
      enterQueuedSession("daily", todayPlan.subjects, DAILY_QUESTION_COUNT, "view-home", "Bilan du jour");
    }

    function enterUltimateSession() {
      enterQueuedSession("ultimate", ALL_SUBJECTS, ULTIMATE_QUESTION_COUNT, "view-home", "Session Ultime");
    }

    window.enterDailySession = enterDailySession;
    window.enterUltimateSession = enterUltimateSession;

    function showQueuedQuestion() {
      if (queueIndex >= queue.length) {
        showQueueSummary();
        return;
      }
      currentQuestion = queue[queueIndex];
      renderQuestion();
    }

    function advanceQueuedQuestion() {
      if (queueSummaryShown) {
        exitQuizSession();
        return;
      }
      queueIndex += 1;
      if (queueIndex >= queue.length) {
        showQueueSummary();
      } else {
        currentQuestion = queue[queueIndex];
        renderQuestion();
      }
    }

    function showQueueSummary() {
      queueSummaryShown = true;
      const total = queue.length;
      const pct = total ? Math.round(queueCorrect / total * 100) : 0;
      const banner = document.getElementById("questionSubjectBanner");
      banner.textContent = queueSummaryTitle;
      banner.className = "quiz-subject-pill quiz-subject-pill--mix";
      document.getElementById("questionSubject").textContent = "Terminé";
      document.getElementById("questionTopic").textContent = `${queueCorrect}/${total}`;
      document.getElementById("questionId").textContent = "100%";
      document.getElementById("questionText").textContent = "Session terminée !";
      document.getElementById("answers").innerHTML = "";
      const feedback = document.getElementById("feedback");
      feedback.hidden = false;
      feedback.className = "quiz-feedback quiz-feedback--ok";
      feedback.textContent = `${queueCorrect} bonnes réponses sur ${total} (${pct}%). Continue comme ça !`;
      document.getElementById("quizProgressBar").style.width = "100%";
      document.getElementById("nextQuestion").disabled = false;
      document.getElementById("nextQuestion").textContent =
        sessionReturnView === "view-home" ? "Retour à l'accueil" : "Retour au quiz";
    }

    function startOfDay(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function updateCountdown() {
      const now = new Date();
      const days = Math.max(0, Math.ceil((startOfDay(EXAM_DATE) - startOfDay(now)) / DAY));
      const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
      const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
      document.getElementById("daysLeft").textContent = days;
      document.getElementById("daysLabel").textContent = days <= 1 ? "jour" : "jours";
      document.getElementById("todayLabel").textContent = `${dayNames[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()]}`;
      const bar = document.getElementById("countdownBar");
      if (bar) {
        const pct = Math.min(100, Math.max(0, (1 - days / 30) * 100));
        bar.style.width = `${pct}%`;
      }
      updateHomeDaily();
    }

    function updateStats() {
      const pct = state.answered ? Math.round(state.correct / state.answered * 100) : 0;
      document.getElementById("scoreValue").textContent = `${pct}%`;
      document.getElementById("answeredValue").textContent = state.answered;
      document.getElementById("streakValue").textContent = state.streak;
      document.getElementById("seenValue").textContent = state.seen.length;
      saveState();
    }

    function renderSubjects() {
      const wrap = document.getElementById("subjectGrid");
      if (!wrap) return;

      const bankTotalEl = document.getElementById("quizBankTotal");
      if (bankTotalEl && window.QuestionBank) {
        const counts = window.QuestionBank.countBySubject();
        bankTotalEl.textContent = String(Object.values(counts).reduce((a, b) => a + b, 0));
      }

      const mixProgress = ALL_SUBJECTS.reduce((sum, id) => sum + (state.seenBySubject[id]?.length || 0), 0);
      const mixTotal = BANK_SIZE * ALL_SUBJECTS.length;
      const mixPct = mixTotal ? Math.round(mixProgress / mixTotal * 100) : 0;

      const mixCard = `
        <button class="browse-hero browse-hero--mix subject-card--mix" type="button" data-subject="mix">
          <div class="browse-hero-top">
            <span class="browse-hero-icon">${SUBJECT_ICONS.mix}</span>
            <span class="browse-badge">${BANK_SIZE * ALL_SUBJECTS.length} Q</span>
          </div>
          <h2 class="browse-hero-title">Mix toutes matières</h2>
          <p class="browse-hero-sub">40 questions · annales DNB 2021–2025</p>
          <div class="browse-progress">
            <div class="browse-progress-track"><div class="browse-progress-fill" style="width:${mixPct}%"></div></div>
            <span class="browse-progress-label">${mixProgress} / ${mixTotal} vues</span>
          </div>
          <span class="browse-cta">Lancer →</span>
        </button>
      `;

      const grid = subjects.filter((s) => s.id !== "mix").map((s) => {
        const { seen, total, pct } = getSubjectProgress(s.id);
        const prob = SUBJECT_PROB[s.id];
        return `
          <button class="browse-tile browse-tile--${s.id}" type="button" data-subject="${s.id}">
            <div class="browse-tile-head">
              <span class="browse-tile-icon">${SUBJECT_ICONS[s.id]}</span>
              <span class="browse-tile-prob">${prob}%</span>
            </div>
            <h3 class="browse-tile-title">${s.label}</h3>
            <p class="browse-tile-likely"><span>Peut tomber :</span> ${SUBJECT_LIKELY[s.id]}</p>
            <div class="browse-progress browse-progress--sm">
              <div class="browse-progress-track"><div class="browse-progress-fill" style="width:${pct}%"></div></div>
              <span class="browse-progress-label">${seen} / ${total} vues</span>
            </div>
          </button>
        `;
      }).join("");

      wrap.innerHTML = `<div class="quiz-browse">${mixCard}<div class="browse-grid">${grid}</div></div>`;
      wrap.querySelectorAll("button[data-subject]").forEach((button) => {
        button.addEventListener("click", () => {
          activeSubject = button.dataset.subject;
          enterQuizSession();
        });
      });
    }

    function enterQuizSession() {
      const ids = activeSubject === "mix" ? ALL_SUBJECTS : [activeSubject];
      const label = subjects.find(s => s.id === activeSubject)?.label || "Mix";
      enterQueuedSession("subject", ids, SUBJECT_QUESTION_COUNT, "view-quiz", `Bilan · ${label}`);
    }

    window.exitQuizSession = function () {
      sessionMode = "free";
      queue = [];
      queueIndex = 0;
      queueSummaryShown = false;
      document.getElementById("app").classList.remove("app--quiz");
      document.getElementById("quizSession").hidden = true;
      document.querySelectorAll(".view").forEach(v => v.classList.remove("view--active"));
      document.getElementById(sessionReturnView).classList.add("view--active");
      document.getElementById("nextQuestion").textContent = "Suivant";
      if (sessionReturnView === "view-quiz") renderSubjects();
    };

    function renderPriorities() {
      const colors = {
        Maths: "var(--maths)",
        Français: "var(--francais)",
        Histoire: "var(--histoire)",
        Géographie: "var(--sciences)",
        EMC: "var(--emc)",
        Sciences: "var(--sciences)"
      };
      document.getElementById("priorityGrid").innerHTML = priorities.map((item) => `
        <article class="prio-card" style="--p-color:${colors[item.subject] || "var(--ink-3)"}">
          <div class="prio-head">
            <span class="prio-subject">${item.subject}</span>
            <span class="prio-score">${item.score}%</span>
          </div>
          <h3 class="prio-title">${item.topic}</h3>
          <p class="prio-why">${item.why}</p>
          <p class="prio-likely"><span>Peut tomber :</span> ${item.likely}</p>
        </article>
      `).join("");
    }

    function renderPlan() {
      const today = new Date().getDate();
      document.getElementById("planGrid").innerHTML = plan.map(day => {
        const isToday = Number(day.date) === today;
        const isExam = day.tone === "exam";
        const cls = ["plan-card", isToday ? "plan-card--today" : "", isExam ? "plan-card--exam" : ""].filter(Boolean).join(" ");
        return `
          <article class="${cls}">
            <div class="plan-date">
              <span class="plan-date-num">${day.date}</span>
              <span class="plan-date-mon">juin</span>
            </div>
            <div class="plan-body">
              <div class="plan-label">${day.label}</div>
              <div class="plan-work">${day.work}</div>
            </div>
          </article>
        `;
      }).join("");
    }

    function renderQuestion() {
      const isQueued = isQueuedMode();
      if (!isQueued) sessionCount += 1;

      const qNum = isQueued ? queueIndex + 1 : sessionCount;
      const qTotal = isQueued ? queueTotal : null;

      document.getElementById("questionId").textContent = qTotal ? `${qNum}/${qTotal}` : `Q${qNum}`;

      const displayName = getSubjectDisplayName(currentQuestion);
      const banner = document.getElementById("questionSubjectBanner");
      banner.textContent = displayName;
      banner.className = `quiz-subject-pill ${getSubjectBannerClass(currentQuestion)}`;

      document.getElementById("questionSubject").textContent = displayName;
      document.getElementById("questionTopic").textContent = currentQuestion.topic;
      document.getElementById("questionText").textContent = currentQuestion.prompt;
      const feedback = document.getElementById("feedback");
      feedback.hidden = true;
      feedback.className = "quiz-feedback";
      feedback.textContent = "";
      document.getElementById("nextQuestion").disabled = true;

      const progress = isQueued
        ? ((queueIndex + 1) / queueTotal) * 100
        : Math.min(100, sessionCount * 10);
      document.getElementById("quizProgressBar").style.width = `${progress}%`;

      const quizContent = document.querySelector(".quiz-content");
      if (quizContent) {
        quizContent.classList.remove("quiz-content--in");
        void quizContent.offsetWidth;
        quizContent.classList.add("quiz-content--in");
      }

      document.getElementById("answers").innerHTML = currentQuestion.choices.map((choiceItem, index) => `
        <button class="quiz-answer quiz-answer--enter" type="button" data-index="${index}" style="animation-delay:${index * 45}ms">
          <span class="quiz-answer-letter">${LETTERS[index]}</span>
          <span>${choiceItem.text}</span>
        </button>
      `).join("");
      document.querySelectorAll(".quiz-answer").forEach(button => {
        button.addEventListener("click", () => answerQuestion(Number(button.dataset.index)));
      });
    }

    function answerQuestion(index) {
      const buttons = [...document.querySelectorAll("#answers .quiz-answer")];
      if (buttons.some(button => button.disabled)) return;

      const selected = currentQuestion.choices[index];
      buttons.forEach((button, buttonIndex) => {
        button.disabled = true;
        if (currentQuestion.choices[buttonIndex].correct) button.classList.add("quiz-answer--correct");
        if (buttonIndex === index && !selected.correct) button.classList.add("quiz-answer--wrong");
      });

      state.answered += 1;
      const feedback = document.getElementById("feedback");
      feedback.hidden = false;
      if (selected.correct) {
        state.correct += 1;
        state.streak += 1;
        if (isQueuedMode()) queueCorrect += 1;
        feedback.className = "quiz-feedback quiz-feedback--ok";
        feedback.textContent = `✓ ${currentQuestion.explanation}`;
        if (navigator.vibrate) navigator.vibrate(10);
        if (typeof window.nativeHaptic === "function") window.nativeHaptic("success");
      } else {
        state.streak = 0;
        feedback.className = "quiz-feedback quiz-feedback--no";
        feedback.textContent = `Réponse : ${currentQuestion.answer}. ${currentQuestion.explanation}`;
        if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
        if (typeof window.nativeHaptic === "function") window.nativeHaptic("error");
      }
      document.getElementById("nextQuestion").disabled = false;
      updateStats();
    }

    function resetStats() {
      if (!confirm("Remettre toutes les stats à zéro ?")) return;
      state.answered = 0;
      state.correct = 0;
      state.streak = 0;
      state.seen = [];
      state.seenBySubject = {};
      sessionCount = 0;
      updateStats();
      renderSubjects();
    }

    document.getElementById("nextQuestion").addEventListener("click", () => {
      if (isQueuedMode()) advanceQueuedQuestion();
    });
    document.getElementById("resetStats").addEventListener("click", resetStats);
    document.getElementById("startDaily").addEventListener("click", enterDailySession);
    document.getElementById("startUltimate").addEventListener("click", enterUltimateSession);

    window.refreshQuizBrowse = renderSubjects;

    updateCountdown();
    renderSubjects();
    renderPriorities();
    renderPlan();
    updateStats();
    setInterval(updateCountdown, 60 * 1000);
  