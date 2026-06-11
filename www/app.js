    const EXAM_DATE = new Date(2026, 5, 18, 8, 0, 0);
    const DAY = 24 * 60 * 60 * 1000;
    const STORAGE_KEY = "brevet2026-engine-state";
    const LETTERS = ["A", "B", "C", "D"];

    const subjects = [
      { id: "mix", label: "Mix" },
      { id: "maths", label: "Maths" },
      { id: "francais", label: "FranÃ§ais" },
      { id: "histoire", label: "Histoire-GÃ©o" },
      { id: "emc", label: "EMC" },
      { id: "sciences", label: "Sciences" }
    ];

    const priorities = [
      { subject: "Maths", topic: "Automatismes 2026", score: 96, color: "var(--maths)", why: "Partie dÃ©diÃ©e de 20 minutes : calcul mental, fractions, pourcentages, puissances, gÃ©omÃ©trie rapide." },
      { subject: "FranÃ§ais", topic: "ComprÃ©hension + grammaire", score: 92, color: "var(--francais)", why: "Toujours central : lecture prÃ©cise, rÃ©Ã©criture, accords, valeurs des temps, justification." },
      { subject: "Histoire", topic: "WW2 / Guerre froide", score: 88, color: "var(--histoire)", why: "RepÃ¨res chronologiques trÃ¨s rentables et dÃ©veloppement construit possible." },
      { subject: "GÃ©ographie", topic: "France productive et amÃ©nagÃ©e", score: 84, color: "var(--sciences)", why: "Espaces productifs, aires urbaines, mobilitÃ©s, amÃ©nagement du territoire, croquis simple." },
      { subject: "EMC", topic: "CitoyennetÃ© / laÃ¯citÃ©", score: 80, color: "var(--emc)", why: "Situation pratique frÃ©quente : droits, devoirs, valeurs, engagement, institutions." },
      { subject: "Sciences", topic: "DonnÃ©es, unitÃ©s, formules", score: 78, color: "var(--sciences)", why: "Le plus rentable : savoir extraire une donnÃ©e, appliquer une formule et conclure avec unitÃ©." }
    ];

    const plan = [
      { date: "11", label: "Aujourd'hui", work: "Maths auto + WW2", tone: "normal" },
      { date: "12", label: "Vendredi", work: "FranÃ§ais + EMC", tone: "normal" },
      { date: "13", label: "Samedi", work: "GÃ©o France + sciences", tone: "normal" },
      { date: "14", label: "Dimanche", work: "Annales courtes", tone: "normal" },
      { date: "15", label: "Lundi", work: "Maths problÃ¨mes", tone: "normal" },
      { date: "16", label: "Mardi", work: "RÃ©daction + repÃ¨res", tone: "normal" },
      { date: "17", label: "Mercredi", work: "Dates + matÃ©riel", tone: "normal" },
      { date: "18", label: "Jeudi", work: "Brevet", tone: "exam" }
    ];

    const historyFacts = [
      ["1er septembre 1939", "Invasion de la Pologne par l'Allemagne : dÃ©but de la Seconde Guerre mondiale en Europe."],
      ["18 juin 1940", "Appel du gÃ©nÃ©ral de Gaulle depuis Londres."],
      ["22 juin 1940", "Armistice franco-allemand et installation du rÃ©gime de Vichy."],
      ["6 juin 1944", "DÃ©barquement alliÃ© en Normandie."],
      ["8 mai 1945", "Capitulation de l'Allemagne nazie en Europe."],
      ["1947", "Doctrine Truman, plan Marshall et dÃ©but de la Guerre froide."],
      ["1948-1949", "Blocus de Berlin."],
      ["1961", "Construction du mur de Berlin."],
      ["1962", "Crise des missiles de Cuba et indÃ©pendance de l'AlgÃ©rie."],
      ["9 novembre 1989", "Chute du mur de Berlin."]
    ];

    const geoFacts = [
      ["espace productif", "Espace organisÃ© pour produire des richesses : agriculture, industrie ou services."],
      ["aire urbaine", "Ensemble formÃ© par un pÃ´le urbain et sa couronne pÃ©riurbaine."],
      ["mÃ©tropolisation", "Concentration des populations, activitÃ©s et pouvoirs dans les grandes villes."],
      ["amÃ©nagement du territoire", "Action visant Ã  rÃ©duire les inÃ©galitÃ©s et organiser les espaces."],
      ["DROM", "Territoires ultramarins franÃ§ais avec contraintes d'Ã©loignement et atouts stratÃ©giques."],
      ["mobilitÃ©s", "DÃ©placements de personnes, quotidiens ou Ã  plus longue distance."]
    ];

    const emcFacts = [
      ["laÃ¯citÃ©", "NeutralitÃ© de l'Ã‰tat et libertÃ© de conscience."],
      ["citoyen", "Personne qui possÃ¨de des droits politiques et participe Ã  la vie dÃ©mocratique."],
      ["dÃ©mocratie", "RÃ©gime oÃ¹ la souverainetÃ© appartient au peuple."],
      ["discrimination", "Traitement dÃ©favorable interdit par la loi sur un critÃ¨re prÃ©cis."],
      ["libertÃ© d'expression", "Droit d'exprimer ses idÃ©es dans les limites fixÃ©es par la loi."],
      ["Constitution", "Texte qui organise les pouvoirs et garantit les droits fondamentaux."]
    ];

    const frenchItems = [
      { topic: "Homophones", q: "ComplÃ¨te : il ___ rÃ©visÃ© ses formules.", answers: ["a", "Ã ", "as", "ha"], correct: "a", explain: "On peut remplacer par \u201Cavait\u201D : il avait rÃ©visÃ©." },
      { topic: "Accords", q: "Quelle phrase est correctement accordÃ©e ?", answers: ["Les copies sont corrigÃ©.", "Les copies sont corrigÃ©es.", "Les copies est corrigÃ©es.", "Les copie sont corrigÃ©es."], correct: "Les copies sont corrigÃ©es.", explain: "Le participe passÃ© employÃ© avec Ãªtre s\u2019accorde avec le sujet \u201Ccopies\u201D." },
      { topic: "Valeurs des temps", q: "Dans \u201CIl marchait quand l\u2019orage Ã©clata\u201D, l\u2019imparfait exprime...", answers: ["une action de premier plan", "une action d\u2019arriÃ¨re-plan", "un ordre", "une hypothÃ¨se"], correct: "une action d\u2019arriÃ¨re-plan", explain: "L\u2019imparfait installe le dÃ©cor ; le passÃ© simple marque l\u2019Ã©vÃ©nement." },
      { topic: "RÃ©Ã©criture", q: "Transforme au pluriel : \u201CCe cheval rapide franchit l\u2019obstacle.\u201D", answers: ["Ces chevaux rapides franchissent l\u2019obstacle.", "Ces cheval rapides franchit l\u2019obstacle.", "Ce chevaux rapide franchissent l\u2019obstacle.", "Ces chevaux rapide franchit l\u2019obstacle."], correct: "Ces chevaux rapides franchissent l\u2019obstacle.", explain: "Ce devient ces, cheval devient chevaux, rapide s\u2019accorde, franchit devient franchissent." },
      { topic: "Argumentation", q: "Dans un paragraphe argumentÃ©, l'exemple sert surtout Ã ...", answers: ["dÃ©corer la copie", "prouver et prÃ©ciser l'idÃ©e", "remplacer la thÃ¨se", "allonger sans raison"], correct: "prouver et prÃ©ciser l'idÃ©e", explain: "Une idÃ©e solide s'appuie sur un exemple prÃ©cis." },
      { topic: "ComprÃ©hension", q: "Pour justifier une rÃ©ponse sur un texte, il faut d'abord...", answers: ["citer ou reformuler un indice prÃ©cis", "donner son avis seulement", "Ã©crire plus long", "changer de sujet"], correct: "citer ou reformuler un indice prÃ©cis", explain: "La justification doit venir du texte ou de l'image." }
    ];

    const state = loadState();
    let currentQuestion = null;
    let activeSubject = "mix";

    function loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        return {
          answered: saved.answered || 0,
          correct: saved.correct || 0,
          streak: saved.streak || 0,
          seen: Array.isArray(saved.seen) ? saved.seen.slice(-180) : []
        };
      } catch {
        return { answered: 0, correct: 0, streak: 0, seen: [] };
      }
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Le site doit rester utilisable mÃªme si le stockage local est bloquÃ©.
      }
    }

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function choice(items) {
      return items[rand(0, items.length - 1)];
    }

    function shuffle(items) {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = rand(0, i);
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function unique(items) {
      return [...new Set(items.map(String))];
    }

    function makeChoices(correct, distractors) {
      const options = unique([correct, ...distractors]).slice(0, 4);
      while (options.length < 4) {
        const candidate = String(rand(2, 99));
        if (!options.includes(candidate)) options.push(candidate);
      }
      return shuffle(options).map(text => ({ text, correct: text === String(correct) }));
    }

    function gcd(a, b) {
      return b === 0 ? Math.abs(a) : gcd(b, a % b);
    }

    const factories = [
      {
        subject: "maths",
        topic: "Automatismes",
        weight: 16,
        make() {
          const n = rand(4, 15);
          return q("Maths", "Automatismes", `Quel est le rÃ©sultat de ${n}Â² ?`, String(n * n), [n * 2, n * 10, n * n + n, n * n - 1], `${n}Â² = ${n} Ã— ${n} = ${n * n}.`);
        }
      },
      {
        subject: "maths",
        topic: "Pourcentages",
        weight: 14,
        make() {
          const base = choice([40, 50, 60, 80, 120, 150, 200, 240]);
          const pct = choice([5, 10, 15, 20, 25, 30, 40]);
          const result = base * pct / 100;
          return q("Maths", "Pourcentages", `Combien vaut ${pct} % de ${base} ?`, String(result), [result + 5, result * 2, Math.max(1, result - 3), base - result], `${pct} % de ${base} = ${base} Ã— ${pct} / 100 = ${result}.`);
        }
      },
      {
        subject: "maths",
        topic: "Fractions",
        weight: 12,
        make() {
          const den = choice([6, 8, 10, 12, 14, 16, 18]);
          const num = choice([2, 4, 6, 8]);
          const d = gcd(num, den);
          const answer = `${num / d}/${den / d}`;
          return q("Maths", "Fractions", `Simplifie la fraction ${num}/${den}.`, answer, [`${num}/${den / d}`, `${num / d}/${den}`, `${den / d}/${num / d}`, `${num + d}/${den}`], `On divise le numÃ©rateur et le dÃ©nominateur par ${d}.`);
        }
      },
      {
        subject: "maths",
        topic: "Fonctions",
        weight: 12,
        make() {
          const a = rand(2, 6);
          const b = rand(-5, 9);
          const x = rand(2, 9);
          const value = a * x + b;
          const sign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
          return q("Maths", "Fonctions", `Si f(x) = ${a}x ${sign}, combien vaut f(${x}) ?`, String(value), [value + a, value - b, a + x + b, value + 2], `On remplace x par ${x} : ${a} Ã— ${x} ${sign} = ${value}.`);
        }
      },
      {
        subject: "maths",
        topic: "ProbabilitÃ©s",
        weight: 11,
        make() {
          const red = rand(2, 8);
          const blue = rand(2, 8);
          const total = red + blue;
          const answer = `${red}/${total}`;
          return q("Maths", "ProbabilitÃ©s", `Dans une urne, il y a ${red} boules rouges et ${blue} boules bleues. ProbabilitÃ© de tirer une rouge ?`, answer, [`${blue}/${total}`, `${red}/${blue}`, `${total}/${red}`, `${red + 1}/${total}`], `Cas favorables : ${red}. Cas possibles : ${total}. Donc ${answer}.`);
        }
      },
      {
        subject: "maths",
        topic: "Pythagore",
        weight: 10,
        make() {
          const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]];
          const [a, b, c] = choice(triples);
          return q("Maths", "Pythagore", `Un triangle rectangle a pour cÃ´tÃ©s de l'angle droit ${a} cm et ${b} cm. Longueur de l'hypotÃ©nuse ?`, `${c} cm`, [`${a + b} cm`, `${c - 1} cm`, `${Math.abs(b - a)} cm`, `${c + 2} cm`], `cÂ² = ${a}Â² + ${b}Â² = ${a * a + b * b}, donc c = ${c} cm.`);
        }
      },
      {
        subject: "sciences",
        topic: "Vitesse",
        weight: 9,
        make() {
          const speed = choice([4, 5, 6, 8, 10, 12]);
          const time = choice([3, 4, 5, 6]);
          const distance = speed * time;
          return q("Sciences", "Vitesse", `Un objet parcourt ${distance} m en ${time} s. Sa vitesse est...`, `${speed} m/s`, [`${distance + time} m/s`, `${time / distance} m/s`, `${distance * time} m/s`, `${speed + 2} m/s`], `v = d / t = ${distance} / ${time} = ${speed} m/s.`);
        }
      },
      {
        subject: "sciences",
        topic: "Ã‰lectricitÃ©",
        weight: 8,
        make() {
          const r = choice([5, 10, 20, 25, 50]);
          const i = choice([0.2, 0.4, 0.5, 0.8, 1]);
          const u = Number((r * i).toFixed(1));
          return q("Sciences", "Ã‰lectricitÃ©", `Avec R = ${r} Î© et I = ${i} A, quelle est la tension U ?`, `${u} V`, [`${r + i} V`, `${r / i} V`, `${Math.max(1, u - 2)} V`, `${u + 5} V`], `Loi d'Ohm : U = R Ã— I = ${r} Ã— ${i} = ${u} V.`);
        }
      },
      {
        subject: "sciences",
        topic: "SVT",
        weight: 7,
        make() {
          const items = [
            ["Quel organe assure principalement les Ã©changes gazeux avec le sang ?", "Les poumons", ["Le foie", "L'estomac", "Le rein"], "Les alvÃ©oles pulmonaires permettent les Ã©changes entre l'air et le sang."],
            ["Quel support porte l'information gÃ©nÃ©tique dans le noyau ?", "L'ADN", ["Le plasma", "Le dioxygÃ¨ne", "Le glucose"], "L'ADN porte l'information gÃ©nÃ©tique sous forme de gÃ¨nes."],
            ["Dans une chaÃ®ne alimentaire, un producteur primaire est souvent...", "un vÃ©gÃ©tal chlorophyllien", ["un prÃ©dateur", "un parasite", "un dÃ©composeur uniquement"], "Les vÃ©gÃ©taux produisent de la matiÃ¨re organique grÃ¢ce Ã  la photosynthÃ¨se."]
          ];
          const item = choice(items);
          return q("Sciences", "SVT", item[0], item[1], item[2], item[3]);
        }
      },
      {
        subject: "francais",
        topic: "FranÃ§ais",
        weight: 13,
        make() {
          const item = choice(frenchItems);
          return q("FranÃ§ais", item.topic, item.q, item.correct, item.answers.filter(a => a !== item.correct), item.explain);
        }
      },
      {
        subject: "histoire",
        topic: "RepÃ¨res",
        weight: 11,
        make() {
          const [date, meaning] = choice(historyFacts);
          const wrong = shuffle(historyFacts.filter(f => f[0] !== date).map(f => f[0])).slice(0, 3);
          return q("Histoire-GÃ©o", "RepÃ¨res", `${meaning} Quelle date faut-il retenir ?`, date, wrong, `${date} : ${meaning}`);
        }
      },
      {
        subject: "histoire",
        topic: "GÃ©ographie",
        weight: 10,
        make() {
          const [term, def] = choice(geoFacts);
          const wrong = shuffle(geoFacts.filter(f => f[0] !== term).map(f => f[0])).slice(0, 3);
          return q("Histoire-GÃ©o", "GÃ©ographie", `${def} Quel est le bon terme ?`, term, wrong, `${term} : ${def}`);
        }
      },
      {
        subject: "emc",
        topic: "CitoyennetÃ©",
        weight: 9,
        make() {
          const [term, def] = choice(emcFacts);
          const wrong = shuffle(emcFacts.filter(f => f[0] !== term).map(f => f[0])).slice(0, 3);
          return q("EMC", "CitoyennetÃ©", `${def} Quel mot correspond ?`, term, wrong, `${term} : ${def}`);
        }
      }
    ];

    function q(subject, topic, prompt, correct, distractors, explanation) {
      return {
        subject,
        topic,
        prompt,
        choices: makeChoices(correct, distractors),
        answer: String(correct),
        explanation
      };
    }

    function startOfDay(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function updateCountdown() {
      const now = new Date();
      const days = Math.max(0, Math.ceil((startOfDay(EXAM_DATE) - startOfDay(now)) / DAY));
      const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
      const monthNames = ["janvier", "fÃ©vrier", "mars", "avril", "mai", "juin", "juillet", "aoÃ»t", "septembre", "octobre", "novembre", "dÃ©cembre"];
      document.getElementById("daysLeft").textContent = days;
      document.getElementById("daysLabel").textContent = days <= 1 ? "jour restant" : "jours restants";
      document.getElementById("todayLabel").textContent = `${dayNames[now.getDay()]} ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
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
      const wrap = document.getElementById("subjectChips");
      wrap.innerHTML = subjects.map(s =>
        `<button class="chip ${s.id === activeSubject ? "active" : ""}" type="button" data-subject="${s.id}">${s.label}</button>`
      ).join("");
      wrap.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
          activeSubject = button.dataset.subject;
          renderSubjects();
          drawQuestion();
        });
      });
    }

    function renderPriorities() {
      document.getElementById("priorityGrid").innerHTML = priorities.map(item => `
        <article class="priority-card" style="--accent:${item.color};--w:${item.score}%">
          <div class="priority-subject">${item.subject}</div>
          <h3>${item.topic}</h3>
          <div class="priority-score-row">
            <span class="priority-score">${item.score}%</span>
            <div class="bar-track"><span class="bar-fill"></span></div>
          </div>
          <p>${item.why}</p>
        </article>
      `).join("");
    }

    function renderPlan() {
      document.getElementById("planGrid").innerHTML = plan.map(day => `
        <article class="day-card ${day.tone === "exam" ? "exam" : ""}">
          <div class="day-label">${day.label}</div>
          <div class="day-date">${day.date}</div>
          <div class="day-work">${day.work}</div>
        </article>
      `).join("");
    }

    function filteredFactories() {
      if (activeSubject === "mix") return factories;
      return factories.filter(factory => factory.subject === activeSubject);
    }

    function weightedFactory() {
      const list = filteredFactories();
      const total = list.reduce((sum, factory) => sum + factory.weight, 0);
      let pick = Math.random() * total;
      for (const factory of list) {
        pick -= factory.weight;
        if (pick <= 0) return factory;
      }
      return list[list.length - 1];
    }

    function signature(question) {
      return `${question.subject}|${question.topic}|${question.prompt}|${question.answer}`.toLowerCase();
    }

    function drawQuestion() {
      let question = null;
      let sig = "";

      for (let tries = 0; tries < 80; tries += 1) {
        question = weightedFactory().make();
        sig = signature(question);
        if (!state.seen.includes(sig)) break;
        if (tries === 60) state.seen = state.seen.slice(-50);
      }

      currentQuestion = question;
      state.seen.push(sig);
      state.seen = state.seen.slice(-180);
      renderQuestion();
      updateStats();
    }

    function renderQuestion() {
      document.getElementById("questionSubject").textContent = currentQuestion.subject;
      document.getElementById("questionTopic").textContent = currentQuestion.topic;
      document.getElementById("questionId").textContent = `Variante ${state.seen.length}`;
      document.getElementById("questionText").textContent = currentQuestion.prompt;
      document.getElementById("feedback").textContent = "Choisis une rÃ©ponse.";
      document.getElementById("feedback").className = "feedback";
      document.getElementById("engineStatus").textContent = "Sans rÃ©pÃ©tition rÃ©cente";
      document.getElementById("answers").innerHTML = currentQuestion.choices.map((choiceItem, index) => `
        <button class="answer" type="button" data-index="${index}" data-letter="${LETTERS[index]}">${choiceItem.text}</button>
      `).join("");

      document.querySelectorAll(".answer").forEach(button => {
        button.addEventListener("click", () => answerQuestion(Number(button.dataset.index)));
      });
    }

    function answerQuestion(index) {
      const buttons = [...document.querySelectorAll("#answers .answer")];
      if (buttons.some(button => button.disabled)) return;

      const selected = currentQuestion.choices[index];
      buttons.forEach((button, buttonIndex) => {
        button.disabled = true;
        if (currentQuestion.choices[buttonIndex].correct) button.classList.add("correct");
        if (buttonIndex === index && !selected.correct) button.classList.add("wrong");
      });

      state.answered += 1;
      if (selected.correct) {
        state.correct += 1;
        state.streak += 1;
        document.getElementById("feedback").className = "feedback ok";
        document.getElementById("feedback").textContent = `Oui. ${currentQuestion.explanation}`;
      } else {
        state.streak = 0;
        document.getElementById("feedback").className = "feedback no";
        document.getElementById("feedback").textContent = `Pas tout Ã  fait. RÃ©ponse : ${currentQuestion.answer}. ${currentQuestion.explanation}`;
      }
      updateStats();
    }

    function resetStats() {
      state.answered = 0;
      state.correct = 0;
      state.streak = 0;
      state.seen = [];
      updateStats();
      drawQuestion();
    }

    document.getElementById("nextQuestion").addEventListener("click", drawQuestion);
    document.getElementById("resetStats").addEventListener("click", resetStats);

    updateCountdown();
    renderSubjects();
    renderPriorities();
    renderPlan();
    updateStats();
    drawQuestion();
    setInterval(updateCountdown, 60 * 1000);
