(function () {
  const FICHES = [
    {
      id: "maths",
      subject: "Maths",
      tag: "96 % probabilité",
      cards: [
        { title: "Automatismes 2026", front: "Quelle partie du contrôle maths dure 20 minutes sans calculatrice ?", back: "Les automatismes : calcul mental, fractions, pourcentages, puissances et petits problèmes rapides. Présents chaque année depuis 2021." },
        { title: "Pourcentages", front: "Comment calcule-t-on 15 % de 240 ?", back: "240 × 15 ÷ 100 = 36. Astuce brevet : repérer 10 % (24) puis ajouter la moitié de 10 % pour 15 %." },
        { title: "Fractions", front: "Comment simplifier 12/18 ?", back: "On divise numérateur et dénominateur par leur PGCD (6) → 2/3. Toujours donner la fraction la plus simple." },
        { title: "Fonctions", front: "Si f(x) = 3x − 2, que vaut f(5) ?", back: "f(5) = 3 × 5 − 2 = 13. Remplacer x, respecter l'ordre des opérations, vérifier le signe." },
        { title: "Pythagore", front: "Dans un triangle rectangle, quelle relation lie les côtés ?", back: "a² + b² = c² où c est l'hypoténuse (le plus grand côté, face à l'angle droit)." },
        { title: "Probabilités", front: "Urne : 3 rouges, 7 bleues. P(rouge) = ?", back: "Cas favorables / cas possibles = 3/10. La probabilité est toujours entre 0 et 1." },
        { title: "Statistiques", front: "Moyenne de 8, 12 et 10 ?", back: "(8 + 12 + 10) ÷ 3 = 10. La moyenne = somme des valeurs ÷ effectif." }
      ]
    },
    {
      id: "francais",
      subject: "Français",
      tag: "92 % probabilité",
      cards: [
        { title: "Compréhension", front: "Comment justifier une réponse au brevet ?", back: "Citer ou reformuler un indice précis du texte, puis l'expliquer. Jamais d'avis personnel sans appui sur le texte." },
        { title: "Homophones", front: "Il ___ révisé (a / à / as) ?", back: "« a » — on peut le remplacer par « avait » : il avait révisé. « à » = préposition, « as » = verbe avoir." },
        { title: "Accords", front: "« Les copies sont corrigé » — quelle erreur ?", back: "Participe passé avec être → accord avec le sujet : « corrigées » (féminin pluriel, sujet « copies »)." },
        { title: "Valeurs des temps", front: "« Il marchait quand l'orage éclata » — rôle de l'imparfait ?", back: "L'imparfait = arrière-plan, décor, habitude. Le passé simple = événement ponctuel qui surgit." },
        { title: "Réécriture", front: "Règle pour mettre « ce cheval rapide » au pluriel ?", back: "Ce → ces, cheval → chevaux, rapide → rapides, verbe accordé au pluriel : « Ces chevaux rapides franchissent… »" },
        { title: "Argumentation", front: "À quoi sert un exemple dans un paragraphe argumenté ?", back: "Prouver et préciser l'idée. Toujours : idée → exemple concret → mini explication du lien." }
      ]
    },
    {
      id: "histoire",
      subject: "Histoire",
      tag: "88 % probabilité",
      cards: [
        { title: "WW2 — début", front: "Quelle date marque le début de la guerre en Europe ?", back: "1er septembre 1939 : invasion de la Pologne par l'Allemagne nazie." },
        { title: "Appel du 18 juin", front: "Que fit de Gaulle le 18 juin 1940 ?", back: "Appel depuis Londres à résister : refus de l'armistice, naissance de la France libre." },
        { title: "Débarquement", front: "Date et lieu du débarquement allié ?", back: "6 juin 1944 en Normandie (opération Overlord) — tournant de la guerre en Europe occidentale." },
        { title: "Capitulation", front: "Quand l'Allemagne capitule-t-elle en Europe ?", back: "8 mai 1945 — fin de la Seconde Guerre mondiale en Europe (commémorée chaque année)." },
        { title: "Guerre froide", front: "Quels événements marquent son début (1947) ?", back: "Doctrine Truman (endiguement), plan Marshall (aide économique), division Est/Ouest." },
        { title: "Mur de Berlin", front: "Dates clés du mur de Berlin ?", back: "Construction : 1961. Chute : 9 novembre 1989 — symbole de la fin de la Guerre froide." },
        { title: "Régime de Vichy", front: "Quand et comment Vichy s'installe-t-il ?", back: "22 juin 1940, armistice franco-allemand. État français dirigé par Pétain, collaboration avec l'Allemagne." }
      ]
    },
    {
      id: "geo",
      subject: "Géographie",
      tag: "84 % probabilité",
      cards: [
        { title: "Espace productif", front: "Qu'est-ce qu'un espace productif ?", back: "Territoire organisé pour produire des richesses : agriculture, industrie ou services selon ses ressources." },
        { title: "Aire urbaine", front: "Définition d'une aire urbaine ?", back: "Pôle urbain (ville-centre) + couronne périurbaine où les habitants travaillent ou consomment dans le pôle." },
        { title: "Métropolisation", front: "Que désigne la métropolisation ?", back: "Concentration croissante des populations, emplois, décisions et services dans les grandes métropoles." },
        { title: "Aménagement", front: "But de l'aménagement du territoire ?", back: "Réduire les inégalités entre territoires, organiser les équipements, corriger les déséquilibres." },
        { title: "DROM", front: "Quelles contraintes pour les DROM ?", back: "Éloignement, insularité, vulnérabilité climatique — mais aussi atouts : biodiversité, position stratégique." },
        { title: "Mobilités", front: "Pourquoi étudier les mobilités au brevet ?", back: "Comprendre déplacements quotidiens et migrations, leurs causes (emploi, études) et impacts sur les territoires." }
      ]
    },
    {
      id: "emc",
      subject: "EMC",
      tag: "80 % probabilité",
      cards: [
        { title: "Laïcité", front: "Que garantit la laïcité à l'école ?", back: "Neutralité de l'État + liberté de conscience. L'école accueille tous les élèves sans imposer de croyance." },
        { title: "Citoyen", front: "Qu'est-ce qu'un citoyen ?", back: "Personne avec des droits politiques (vote, éligibilité) et des devoirs (respect des lois, impôts, défense)." },
        { title: "Démocratie", front: "Principe fondamental de la démocratie ?", back: "La souveraineté appartient au peuple, qui choisit ses représentants par le suffrage." },
        { title: "Discrimination", front: "Qu'est-ce qu'une discrimination ?", back: "Traitement défavorable basé sur un critère (origine, sexe, religion…). Interdite et punie par la loi." },
        { title: "Liberté d'expression", front: "Limites de la liberté d'expression ?", back: "Droit fondamental, mais limité par la loi : pas d'injure, diffamation, provocation à la haine." },
        { title: "Constitution", front: "Rôle de la Constitution de 1958 ?", back: "Texte fondamental : organise les pouvoirs (Président, Parlement, Gouvernement) et garantit les droits." }
      ]
    },
    {
      id: "sciences",
      subject: "SVT & Physique",
      tag: "Épreuve 2026",
      cards: [
        { title: "SVT — Climat", front: "L'effet de serre est lié à quoi ?", back: "Accumulation de gaz à effet de serre (CO₂, CH₄…) qui retiennent une partie du rayonnement. Thème très fréquent 2021-2025." },
        { title: "SVT — Immunité", front: "À quoi sert un vaccin ?", back: "Stimuler le système immunitaire pour produire des anticorps sans tomber gravement malade. Thème 2026 probable." },
        { title: "SVT — Génétique", front: "Où se trouve l'information génétique ?", back: "Dans l'ADN, organisé en gènes sur les chromosomes, dans le noyau des cellules." },
        { title: "Physique — Vitesse", front: "Formule v = ?", back: "v = d / t. Distance en mètres, temps en secondes → m/s. Toujours conclure avec l'unité." },
        { title: "Physique — Électricité", front: "Loi d'Ohm ?", back: "U = R × I. Puissance : P = U × I (en watts). Très classique aux annales." },
        { title: "Physique — Énergie", front: "Énergie potentielle de pesanteur ?", back: "Ep = m × g × h (J). Énergie cinétique : Ec = ½ m v²." },
        { title: "Physique — Chimie", front: "Conservation de la masse ?", back: "Lors d'une transformation chimique, la masse totale des produits = masse totale des réactifs." },
        { title: "SVT — Pathogènes", front: "Un antibiotique agit contre… ?", back: "Certaines bactéries (pas les virus). Se préserver des micro-organismes pathogènes : au programme 2026." }
      ]
    }
  ];

  const ficheState = { deck: null, index: 0, flipped: false };

  function renderFicheList() {
    const wrap = document.getElementById("ficheGrid");
    if (!wrap) return;
    wrap.innerHTML = FICHES.map(f => `
      <button class="fiche-card fiche-card--${f.id}" type="button" data-fiche="${f.id}">
        <span class="fiche-card-subject">${f.subject}</span>
        <span class="fiche-card-tag">${f.tag}</span>
        <span class="fiche-card-count">${f.cards.length} points clés</span>
      </button>
    `).join("");
    wrap.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => openFicheDeck(btn.dataset.fiche));
    });
  }

  function openFicheDeck(id) {
    const deck = FICHES.find(f => f.id === id);
    if (!deck) return;
    ficheState.deck = deck;
    ficheState.index = 0;
    ficheState.flipped = false;
    document.getElementById("app").classList.add("app--fiche");
    const session = document.getElementById("ficheSession");
    session.hidden = false;
    session.classList.remove("fiche-session--in");
    void session.offsetWidth;
    session.classList.add("fiche-session--in");
    renderFicheCard();
  }

  function closeFicheDeck() {
    ficheState.deck = null;
    document.getElementById("app").classList.remove("app--fiche");
    document.getElementById("ficheSession").hidden = true;
  }

  function renderFicheCard() {
    const { deck, index, flipped } = ficheState;
    if (!deck) return;
    const card = deck.cards[index];
    const total = deck.cards.length;
    const flipEl = document.getElementById("ficheFlip");

    document.getElementById("ficheSubject").textContent = deck.subject;
    document.getElementById("ficheProgress").textContent = `${index + 1} / ${total}`;
    document.getElementById("ficheTitle").textContent = card.title;
    document.getElementById("ficheFront").textContent = card.front;
    document.getElementById("ficheBack").textContent = card.back;
    flipEl.classList.remove("fiche-flip--revealed", "fiche-flip--slide");
    void flipEl.offsetWidth;
    flipEl.classList.add("fiche-flip--slide");
    if (flipped) flipEl.classList.add("fiche-flip--revealed");
    document.getElementById("ficheHint").textContent = flipped ? "Appuie pour revoir la question" : "Appuie pour révéler la réponse";

    document.getElementById("fichePrev").disabled = index === 0;
    document.getElementById("ficheNext").textContent = index >= total - 1 ? "Terminer" : "Suivant";

    const dots = document.getElementById("ficheDots");
    dots.innerHTML = deck.cards.map((_, i) =>
      `<span class="fiche-dot${i === index ? " fiche-dot--active" : ""}${i < index ? " fiche-dot--done" : ""}"></span>`
    ).join("");
  }

  function toggleFlip() {
    ficheState.flipped = !ficheState.flipped;
    document.getElementById("ficheFlip").classList.toggle("fiche-flip--revealed", ficheState.flipped);
    document.getElementById("ficheHint").textContent = ficheState.flipped
      ? "Appuie pour revoir la question"
      : "Appuie pour révéler la réponse";
  }

  function nextFicheCard() {
    const { deck, index } = ficheState;
    if (!deck) return;
    if (index >= deck.cards.length - 1) {
      closeFicheDeck();
      return;
    }
    ficheState.index += 1;
    ficheState.flipped = false;
    renderFicheCard();
  }

  function prevFicheCard() {
    if (ficheState.index <= 0) return;
    ficheState.index -= 1;
    ficheState.flipped = false;
    renderFicheCard();
  }

  window.initFiches = function () {
    renderFicheList();
    document.getElementById("ficheBackBtn")?.addEventListener("click", closeFicheDeck);
    document.getElementById("ficheFlip")?.addEventListener("click", toggleFlip);
    document.getElementById("ficheNext")?.addEventListener("click", nextFicheCard);
    document.getElementById("fichePrev")?.addEventListener("click", prevFicheCard);
  };
})();
