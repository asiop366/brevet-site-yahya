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
      { subject: "Maths", topic: "Automatismes 2026", score: 96, color: "var(--maths)", why: "Partie dédiée de 20 minutes : calcul mental, fractions, pourcentages, puissances, géométrie rapide." },
      { subject: "Français", topic: "Compréhension + grammaire", score: 92, color: "var(--francais)", why: "Toujours central : lecture précise, réécriture, accords, valeurs des temps, justification." },
      { subject: "Histoire", topic: "WW2 / Guerre froide", score: 88, color: "var(--histoire)", why: "Repères chronologiques très rentables et développement construit possible." },
      { subject: "Géographie", topic: "France productive et aménagée", score: 84, color: "var(--sciences)", why: "Espaces productifs, aires urbaines, mobilités, aménagement du territoire, croquis simple." },
      { subject: "EMC", topic: "Citoyenneté / laïcité", score: 80, color: "var(--emc)", why: "Situation pratique fréquente : droits, devoirs, valeurs, engagement, institutions." },
      { subject: "Sciences", topic: "SVT + Physique 2026", score: 85, color: "var(--sciences)", why: "Épreuve 2026 : SVT et physique-chimie (30 min chacune). Climat, immunité, génétique · énergie, électricité, mouvements." }
    ];

    const DAILY_QUESTION_COUNT = 45;
    const ULTIMATE_QUESTION_COUNT = 100;
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

    const historyFacts = [
      ["1er septembre 1939", "Invasion de la Pologne par l'Allemagne : début de la Seconde Guerre mondiale en Europe."],
      ["18 juin 1940", "Appel du général de Gaulle depuis Londres."],
      ["22 juin 1940", "Armistice franco-allemand et installation du régime de Vichy."],
      ["6 juin 1944", "Débarquement allié en Normandie."],
      ["8 mai 1945", "Capitulation de l'Allemagne nazie en Europe."],
      ["1947", "Doctrine Truman, plan Marshall et début de la Guerre froide."],
      ["1948-1949", "Blocus de Berlin."],
      ["1961", "Construction du mur de Berlin."],
      ["1962", "Crise des missiles de Cuba et indépendance de l'Algérie."],
      ["9 novembre 1989", "Chute du mur de Berlin."]
    ];

    const geoFacts = [
      ["espace productif", "Espace organisé pour produire des richesses : agriculture, industrie ou services."],
      ["aire urbaine", "Ensemble formé par un pôle urbain et sa couronne périurbaine."],
      ["métropolisation", "Concentration des populations, activités et pouvoirs dans les grandes villes."],
      ["aménagement du territoire", "Action visant à réduire les inégalités et organiser les espaces."],
      ["DROM", "Territoires ultramarins français avec contraintes d'éloignement et atouts stratégiques."],
      ["mobilités", "Déplacements de personnes, quotidiens ou à plus longue distance."]
    ];

    const emcFacts = [
      ["laïcité", "Neutralité de l'État et liberté de conscience."],
      ["citoyen", "Personne qui possède des droits politiques et participe à la vie démocratique."],
      ["démocratie", "Régime où la souveraineté appartient au peuple."],
      ["discrimination", "Traitement défavorable interdit par la loi sur un critère précis."],
      ["liberté d'expression", "Droit d'exprimer ses idées dans les limites fixées par la loi."],
      ["Constitution", "Texte qui organise les pouvoirs et garantit les droits fondamentaux."]
    ];

    const frenchItems = [
      { topic: "Homophones", q: "Complète : il ___ révisé ses formules.", answers: ["a", "à", "as", "ha"], correct: "a", explain: "On peut remplacer par « avait » : il avait révisé." },
      { topic: "Accords", q: "Quelle phrase est correctement accordée ?", answers: ["Les copies sont corrigé.", "Les copies sont corrigées.", "Les copies est corrigées.", "Les copie sont corrigées."], correct: "Les copies sont corrigées.", explain: "Le participe passé employé avec être s'accorde avec le sujet « copies »." },
      { topic: "Valeurs des temps", q: "Dans « Il marchait quand l'orage éclata », l'imparfait exprime...", answers: ["une action de premier plan", "une action d'arrière-plan", "un ordre", "une hypothèse"], correct: "une action d'arrière-plan", explain: "L'imparfait installe le décor ; le passé simple marque l'événement." },
      { topic: "Réécriture", q: "Transforme au pluriel : « Ce cheval rapide franchit l'obstacle. »", answers: ["Ces chevaux rapides franchissent l'obstacle.", "Ces cheval rapides franchit l'obstacle.", "Ce chevaux rapide franchissent l'obstacle.", "Ces chevaux rapide franchit l'obstacle."], correct: "Ces chevaux rapides franchissent l'obstacle.", explain: "Ce → ces, cheval → chevaux, rapide → rapides, franchit → franchissent." },
      { topic: "Argumentation", q: "Dans un paragraphe argumenté, l'exemple sert surtout à...", answers: ["décorer la copie", "prouver et préciser l'idée", "remplacer la thèse", "allonger sans raison"], correct: "prouver et préciser l'idée", explain: "Une idée solide s'appuie sur un exemple précis." },
      { topic: "Compréhension", q: "Pour justifier une réponse sur un texte, il faut d'abord...", answers: ["citer ou reformuler un indice précis", "donner son avis seulement", "écrire plus long", "changer de sujet"], correct: "citer ou reformuler un indice précis", explain: "La justification doit venir du texte ou de l'image." },
      { topic: "Connecteurs", q: "Quel connecteur exprime une opposition ?", answers: ["car", "cependant", "donc", "puis"], correct: "cependant", explain: "« Cependant » introduit une idée qui s'oppose à la précédente." },
      { topic: "Pluriel", q: "Le pluriel de « journal » est...", answers: ["journaus", "journaux", "journalx", "journale"], correct: "journaux", explain: "Les mots en -al font souvent leur pluriel en -aux." }
    ];

    const physicsItems = [
      ["Un cycliste parcourt 150 m en 30 s. Sa vitesse moyenne est...", "5 m/s", ["150 m/s", "0,2 m/s", "180 m/s", "50 m/s"], "v = d/t = 150/30 = 5 m/s. Thème très fréquent 2021-2025."],
      ["Avec R = 12 Ω et I = 0,5 A, la tension U vaut...", "6 V", ["6,5 V", "24 V", "0,04 V", "18 V"], "Loi d'Ohm : U = R × I = 12 × 0,5 = 6 V."],
      ["Un objet de masse 2 kg est soulevé à 3 m. Son énergie potentielle (g = 10 N/kg) vaut...", "60 J", ["6 J", "20 J", "5 J", "30 J"], "Ep = m × g × h = 2 × 10 × 3 = 60 J."],
      ["La puissance électrique vaut P = U × I. Si U = 230 V et I = 2 A, P = ?", "460 W", ["115 W", "232 W", "228 W", "4600 W"], "P = 230 × 2 = 460 W. Énergie et consommation : thème récurrent au brevet."],
      ["Lors d'une réaction chimique, la masse totale des produits est...", "égale à la masse totale des réactifs", ["supérieure aux réactifs", "nulle", "toujours doublée", "imprévisible"], "Conservation de la masse : rien ne se perd, rien ne se crée."],
      ["Un objet en chute libre (sans frottements) subit une force...", "le poids, dirigé vers le centre de la Terre", ["nulle", "perpendiculaire au sol uniquement", "vers le haut", "identique à la poussée d'Archimède"], "Le poids P = m × g. Mouvements et interactions : au programme 2026."],
      ["Convertir 3,6 km/h en m/s donne...", "1 m/s", ["3,6 m/s", "10 m/s", "0,36 m/s", "36 m/s"], "3,6 km/h = 3600 m / 3600 s = 1 m/s."]
    ];

    const svtItems = [
      ["Où se font les échanges de O₂ et CO₂ entre l'air et le sang ?", "Dans les alvéoles pulmonaires", ["Dans la trachée", "Dans le cœur", "Dans l'estomac"], "Les poumons assurent les échanges gazeux via les alvéoles."],
      ["Quel support porte l'information génétique dans le noyau ?", "L'ADN", ["Le glucose", "L'hémoglobine", "Le dioxygène"], "La génétique (ADN, gènes, chromosomes) revient très souvent aux annales."],
      ["Un vaccin stimule surtout...", "le système immunitaire", ["la digestion", "la respiration", "la reproduction"], "Immunité et micro-organismes pathogènes : thème 2026 très probable."],
      ["Dans une chaîne alimentaire, le producteur primaire est...", "un végétal chlorophyllien", ["un prédateur", "un champignon décomposeur seul", "un herbivore"], "Les végétaux produisent la matière organique par photosynthèse."],
      ["L'effet de serre est lié surtout à l'accumulation de...", "gaz à effet de serre (CO₂, CH₄…)", ["azote pur", "oxygène seul", "eau liquide", "sel marin"], "Climat et activité humaine : thème récurrent 2021-2025."],
      ["Dans le tube digestif, l'absorption des nutriments se fait surtout...", "dans l'intestin grêle", ["dans la bouche", "dans l'œsophage", "dans la trachée"], "Digestion et nutrition : classique au brevet."],
      ["Un antibiotique agit principalement contre...", "certaines bactéries", ["les virus", "tous les microbes sans distinction", "les allergies"], "Se préserver des micro-organismes pathogènes : au programme 2026."],
      ["Deux individus avec le même génotype pour un caractère auront...", "le même allèle pour ce gène", ["forcément des yeux identiques", "des chromosomes différents", "un nombre de gènes différent"], "Génétique : génotype = ensemble des allèles d'un individu."]
    ];

    const SUBJECT_ICONS = { mix: "🎯", maths: "📐", francais: "📖", histoire: "🌍", emc: "⚖️", sciences: "🔬" };
    const SUBJECT_DESC = {
      mix: "Toutes matières",
      maths: "Auto & calcul",
      francais: "Grammaire & lecture",
      histoire: "Repères & géo",
      emc: "Citoyenneté",
      sciences: "SVT & Physique 2026"
    };

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
        // Le site doit rester utilisable même si le stockage local est bloqué.
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
          return q("Maths", "Automatismes", `Quel est le résultat de ${n}² ?`, String(n * n), [n * 2, n * 10, n * n + n, n * n - 1], `${n}² = ${n} × ${n} = ${n * n}.`);
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
          return q("Maths", "Pourcentages", `Combien vaut ${pct} % de ${base} ?`, String(result), [result + 5, result * 2, Math.max(1, result - 3), base - result], `${pct} % de ${base} = ${base} × ${pct} / 100 = ${result}.`);
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
          return q("Maths", "Fractions", `Simplifie la fraction ${num}/${den}.`, answer, [`${num}/${den / d}`, `${num / d}/${den}`, `${den / d}/${num / d}`, `${num + d}/${den}`], `On divise le numérateur et le dénominateur par ${d}.`);
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
          return q("Maths", "Fonctions", `Si f(x) = ${a}x ${sign}, combien vaut f(${x}) ?`, String(value), [value + a, value - b, a + x + b, value + 2], `On remplace x par ${x} : ${a} × ${x} ${sign} = ${value}.`);
        }
      },
      {
        subject: "maths",
        topic: "Probabilités",
        weight: 11,
        make() {
          const red = rand(2, 8);
          const blue = rand(2, 8);
          const total = red + blue;
          const answer = `${red}/${total}`;
          return q("Maths", "Probabilités", `Dans une urne, il y a ${red} boules rouges et ${blue} boules bleues. Probabilité de tirer une rouge ?`, answer, [`${blue}/${total}`, `${red}/${blue}`, `${total}/${red}`, `${red + 1}/${total}`], `Cas favorables : ${red}. Cas possibles : ${total}. Donc ${answer}.`);
        }
      },
      {
        subject: "maths",
        topic: "Pythagore",
        weight: 10,
        make() {
          const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]];
          const [a, b, c] = choice(triples);
          return q("Maths", "Pythagore", `Un triangle rectangle a pour côtés de l'angle droit ${a} cm et ${b} cm. Longueur de l'hypoténuse ?`, `${c} cm`, [`${a + b} cm`, `${c - 1} cm`, `${Math.abs(b - a)} cm`, `${c + 2} cm`], `c² = ${a}² + ${b}² = ${a * a + b * b}, donc c = ${c} cm.`);
        }
      },
      {
        subject: "maths",
        topic: "Thalès",
        weight: 10,
        make() {
          const k = choice([2, 2.5, 3, 4]);
          const small = rand(2, 6);
          const large = Number((small * k).toFixed(1));
          return q("Maths", "Thalès", `Deux droites parallèles découpent des transversales. Sur l'une, un segment vaut ${small} cm ; sur l'autre, le segment correspondant vaut ${large} cm. Le rapport est...`, String(k), [String(k + 1), String(k / 2), String(small + large), String(large - small)], `Rapport = ${large}/${small} = ${k}. Thalès revient souvent aux annales.`);
        }
      },
      {
        subject: "maths",
        topic: "Statistiques",
        weight: 9,
        make() {
          const a = rand(4, 12);
          const b = rand(8, 16);
          const c = rand(10, 20);
          const mean = Math.round((a + b + c) / 3 * 10) / 10;
          return q("Maths", "Statistiques", `Moyenne de ${a}, ${b} et ${c} ?`, String(mean), [String(mean + 2), String(a + b), String(c - a), String(mean - 1)], `Moyenne = (${a}+${b}+${c})/3 = ${mean}.`);
        }
      },
      {
        subject: "maths",
        topic: "Puissances",
        weight: 9,
        make() {
          const base = choice([2, 3, 5]);
          const exp = choice([2, 3, 4]);
          const result = base ** exp;
          return q("Maths", "Automatismes", `Combien vaut ${base}${exp === 2 ? "²" : exp === 3 ? "³" : "⁴"} ?`, String(result), [String(result + base), String(base * exp), String(result - 1), String(base + exp)], `${base}^${exp} = ${result}.`);
        }
      },
      {
        subject: "sciences",
        topic: "Physique",
        weight: 10,
        make() {
          const item = choice(physicsItems);
          return q("Sciences", "Physique", item[0], item[1], item[2], item[3]);
        }
      },
      {
        subject: "sciences",
        topic: "SVT",
        weight: 10,
        make() {
          const item = choice(svtItems);
          return q("Sciences", "SVT", item[0], item[1], item[2], item[3]);
        }
      },
      {
        subject: "francais",
        topic: "Français",
        weight: 13,
        make() {
          const item = choice(frenchItems);
          return q("Français", item.topic, item.q, item.correct, item.answers.filter(a => a !== item.correct), item.explain);
        }
      },
      {
        subject: "histoire",
        topic: "Repères",
        weight: 11,
        make() {
          const [date, meaning] = choice(historyFacts);
          const wrong = shuffle(historyFacts.filter(f => f[0] !== date).map(f => f[0])).slice(0, 3);
          return q("Histoire-Géo", "Repères", `${meaning} Quelle date faut-il retenir ?`, date, wrong, `${date} : ${meaning}`);
        }
      },
      {
        subject: "histoire",
        topic: "Géographie",
        weight: 10,
        make() {
          const [term, def] = choice(geoFacts);
          const wrong = shuffle(geoFacts.filter(f => f[0] !== term).map(f => f[0])).slice(0, 3);
          return q("Histoire-Géo", "Géographie", `${def} Quel est le bon terme ?`, term, wrong, `${term} : ${def}`);
        }
      },
      {
        subject: "emc",
        topic: "Citoyenneté",
        weight: 9,
        make() {
          const [term, def] = choice(emcFacts);
          const wrong = shuffle(emcFacts.filter(f => f[0] !== term).map(f => f[0])).slice(0, 3);
          return q("EMC", "Citoyenneté", `${def} Quel mot correspond ?`, term, wrong, `${term} : ${def}`);
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
      const list = factories.filter(f => ids.includes(f.subject));
      const pool = list.length ? list : factories;
      const items = [];
      const sessionSeen = new Set();

      for (let i = 0; i < count; i += 1) {
        let question = null;
        let sig = "";
        for (let tries = 0; tries < 100; tries += 1) {
          question = pool[rand(0, pool.length - 1)].make();
          sig = signature(question);
          if (!sessionSeen.has(sig)) break;
        }
        sessionSeen.add(sig);
        items.push(question);
      }
      return items;
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
      document.getElementById("nextQuestion").textContent = "Retour à l'accueil";
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
      wrap.innerHTML = subjects.map(s => `
        <button class="subject-card subject-card--${s.id}" type="button" data-subject="${s.id}">
          <span class="subject-icon">${SUBJECT_ICONS[s.id]}</span>
          <span class="subject-name">${s.label}</span>
          <span class="subject-desc">${SUBJECT_DESC[s.id]}</span>
        </button>
      `).join("");
      wrap.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
          activeSubject = button.dataset.subject;
          enterQuizSession();
        });
      });
    }

    function enterQuizSession() {
      sessionMode = "free";
      sessionReturnView = "view-quiz";
      queueSummaryShown = false;
      sessionCount = 0;
      document.getElementById("app").classList.add("app--quiz");
      document.getElementById("quizSession").hidden = false;
      document.getElementById("quizSession").classList.remove("quiz-session--in");
      void document.getElementById("quizSession").offsetWidth;
      document.getElementById("quizSession").classList.add("quiz-session--in");
      document.querySelectorAll(".view").forEach(v => v.classList.remove("view--active"));
      document.getElementById("nextQuestion").textContent = "Suivant";
      drawQuestion();
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
      if (sessionMode === "free") sessionCount += 1;

      const isQueued = sessionMode === "daily" || sessionMode === "ultimate";
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
        if (sessionMode === "daily" || sessionMode === "ultimate") queueCorrect += 1;
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
      state.answered = 0;
      state.correct = 0;
      state.streak = 0;
      state.seen = [];
      sessionCount = 0;
      updateStats();
    }

    document.getElementById("nextQuestion").addEventListener("click", () => {
      if (sessionMode === "daily" || sessionMode === "ultimate") advanceQueuedQuestion();
      else drawQuestion();
    });
    document.getElementById("resetStats").addEventListener("click", resetStats);
    document.getElementById("startDaily").addEventListener("click", enterDailySession);
    document.getElementById("startUltimate").addEventListener("click", enterUltimateSession);

    updateCountdown();
    renderSubjects();
    renderPriorities();
    renderPlan();
    updateStats();
    setInterval(updateCountdown, 60 * 1000);
  