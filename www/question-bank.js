(function () {
  const BANK_SIZE = 500;
  const SUBJECTS = ["maths", "francais", "histoire", "emc", "sciences"];

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

  function gcd(a, b) {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  }

  function parseYear(dateStr) {
    const match = String(dateStr).match(/\d{4}/);
    return match ? Number(match[0]) : 9999;
  }

  function seededRandom(seed) {
    let s = Math.abs(seed) % 2147483647 || 1;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function seededShuffle(items, seed) {
    const rng = seededRandom(seed);
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function seededSample(items, count, seed) {
    return seededShuffle(items, seed).slice(0, count);
  }

  function isQualityQuestion(question) {
    const p = question.prompt.toLowerCase();
    if (question.topic === "Calcul") return false;
    if (p.includes("plus ancienne")) return false;
    if (p.includes("plus récente")) return false;
    if (p.includes("remets dans l'ordre")) return false;
    if (p.includes("se situe surtout au") && p.includes("siècle")) return false;
    if (question.topic === "Chronologie") return false;
    if (question.answer && question.answer.length > 120) return false;
    if (p.length < 15) return false;
    return true;
  }

  function normalizePrompt(prompt) {
    let p = String(prompt).trim().replace(/\s+/g, " ");
    if (!p || p.includes("___")) return p;
    if (p.endsWith("...")) return p.slice(0, -3).trim() + " ?";
    if (p.endsWith(":")) return `${p.slice(0, -1).trim()} ?`;
    if (!/[?!…]$/.test(p)) {
      if (p.endsWith(".")) return `${p.slice(0, -1).trim()} ?`;
      return `${p} ?`;
    }
    return p;
  }

  function assignDifficulty(question) {
    const { topic, prompt } = question;
    const p = prompt.toLowerCase();
    let difficulty = 2;

    if (topic === "Calcul") difficulty = 1;
    if (/^quel est \d+ [+\-×x*] \d+/.test(p)) difficulty = 1;
    if (topic === "Homophones" && p.length < 45) difficulty = 1;

    const hardTopics = [
      "Pythagore", "Thalès", "Trigonométrie", "Situations", "Institutions",
      "WW2", "Guerre froide", "Réécriture", "Argumentation", "Automatismes"
    ];
    if (hardTopics.includes(topic)) difficulty = 3;

    if (topic === "Physique" && (p.includes("ohm") || p.includes("énergie") || p.includes("vitesse"))) difficulty = 3;
    if (topic === "SVT" && (p.includes("immunit") || p.includes("génét") || p.includes("climat"))) difficulty = 3;
    if (topic === "Géographie" || topic === "Conjugaison") difficulty = 2;

    return { ...question, difficulty };
  }

  function questionVarietyKey(q) {
    return `${q.bankSubject || q.subject}|${q.topic}|${q.prompt.slice(0, 60)}`.toLowerCase();
  }

  function pickDiverseFromPool(available, count, seed, options) {
    const shuffled = seededShuffle(available, seed);
    const picked = [];
    const usedVariety = new Set();
    const topicCounts = {};
    const maxPerTopic = options?.maxPerTopic || 2;

    for (const q of shuffled) {
      if (picked.length >= count) break;
      const vKey = questionVarietyKey(q);
      if (usedVariety.has(vKey)) continue;
      const tKey = `${q.bankSubject}|${q.topic}`;
      if ((topicCounts[tKey] || 0) >= maxPerTopic) continue;
      usedVariety.add(vKey);
      topicCounts[tKey] = (topicCounts[tKey] || 0) + 1;
      picked.push(q);
    }

    if (picked.length < count) {
      for (const q of shuffled) {
        if (picked.length >= count) break;
        if (!picked.some((p) => p.id === q.id)) picked.push(q);
      }
    }
    return picked;
  }

  function diversifyQueue(items, seed) {
    if (items.length <= 1) return items;
    const result = [];
    const remaining = seededShuffle([...items], seed);
    while (remaining.length) {
      let idx = 0;
      if (result.length) {
        const prevKey = `${result[result.length - 1].bankSubject}|${result[result.length - 1].topic}`;
        const alt = remaining.findIndex((q) => `${q.bankSubject}|${q.topic}` !== prevKey);
        if (alt >= 0) idx = alt;
      }
      result.push(remaining.splice(idx, 1)[0]);
    }
    return result;
  }

  function makeChoices(correct, distractors) {
    const options = unique([correct, ...distractors]).slice(0, 4);
    while (options.length < 4) {
      const candidate = String(rand(2, 99));
      if (!options.includes(candidate)) options.push(candidate);
    }
    return shuffle(options).map((text) => ({ text, correct: text === String(correct) }));
  }

  function q(subject, topic, prompt, correct, distractors, explanation) {
    const answer = String(correct);
    const normalizedPrompt = normalizePrompt(prompt);
    const id = `${subject}|${topic}|${normalizedPrompt}|${answer}`.toLowerCase();
    return {
      id,
      subject,
      topic,
      prompt: normalizedPrompt,
      choices: makeChoices(correct, distractors),
      answer,
      explanation
    };
  }

  const pythagoreanTriples = [
    [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17],
    [7, 24, 25], [9, 12, 15], [12, 16, 20], [9, 40, 41],
    [11, 60, 61], [20, 21, 29], [15, 20, 25], [10, 24, 26]
  ];

  const historyFacts = [
    ["1er septembre 1939", "Invasion de la Pologne par l'Allemagne : début de la Seconde Guerre mondiale en Europe."],
    ["18 juin 1940", "Appel du général de Gaulle depuis Londres."],
    ["22 juin 1940", "Armistice franco-allemand et installation du régime de Vichy."],
    ["6 juin 1944", "Débarquement allié en Normandie."],
    ["8 mai 1945", "Capitulation de l'Allemagne nazie en Europe."],
    ["11 novembre 1918", "Armistice mettant fin à la Première Guerre mondiale."],
    ["28 juin 1914", "Assassinat de l'archiduc François-Ferdinand à Sarajevo."],
    ["1947", "Doctrine Truman, plan Marshall et début de la Guerre froide."],
    ["1948-1949", "Blocus de Berlin."],
    ["1958", "Promulgation de la Constitution de la Ve République."],
    ["1961", "Construction du mur de Berlin."],
    ["1962", "Crise des missiles de Cuba et indépendance de l'Algérie."],
    ["9 novembre 1989", "Chute du mur de Berlin."],
    ["1789", "Prise de la Bastille, symbole de la Révolution française."],
    ["1914-1918", "Dates de la Première Guerre mondiale."],
    ["1939-1945", "Dates de la Seconde Guerre mondiale en Europe."],
    ["10 mai 1940", "Début de la bataille de France et offensive allemande à l'Ouest."],
    ["14 juillet 1789", "Prise de la Bastille pendant la Révolution française."],
    ["4 août 1914", "Entrée en guerre de la France lors de la Première Guerre mondiale."],
    ["24 octobre 1945", "Création de l'ONU."],
    ["1945", "Conférences de Yalta et Potsdam : réorganisation du monde après 1945."],
    ["1950-1953", "Guerre de Corée."],
    ["1954", "Défaite de Dien Bien Phu et début de la guerre d'Algérie."],
    ["1957", "Traité de Rome : création de la CEE."],
    ["1968", "Mai 68 en France et printemps de Prague."],
    ["1975", "Fin de la guerre du Vietnam."],
    ["1980", "Grève des chantiers navals de Gdańsk en Pologne."],
    ["1991", "Disparition de l'URSS et fin de la Guerre froide."],
    ["2001", "Attentats du 11 septembre aux États-Unis."],
    ["2015", "Attentats terroristes à Paris et Saint-Denis."],
    ["1940-1944", "Période d'occupation de la France par l'Allemagne nazie."],
    ["1944", "Libération de Paris et avancée alliée en France."],
    ["1919", "Traité de Versailles mettant fin à la Première Guerre mondiale."],
    ["1933", "Hitler devient chancelier en Allemagne."],
    ["1941", "Attaque de Pearl Harbor : les États-Unis entrent en guerre."],
    ["1942", "Rafle du Vélodrome d'Hiver (Vel d'Hiv) à Paris."],
    ["1943", "Armistice en Italie et bataille de Stalingrad."],
    ["6 et 9 août 1945", "Bombardements atomiques sur Hiroshima et Nagasaki."],
    ["1950", "Début de la guerre de Corée."],
    ["1969", "Premier pas de l'homme sur la Lune."],
    ["1974", "Démission du président Nixon aux États-Unis."],
    ["1986", "Catastrophe de Tchernobyl."],
    ["1989", "Chute du mur de Berlin et révolutions en Europe de l'Est."],
    ["2004", "Élargissement de l'Union européenne à 10 nouveaux pays."],
    ["2011", "Printemps arabe et révoltes dans le monde arabe."],
    ["2020", "Début de la pandémie de Covid-19."],
    ["1871", "Proclamation de la IIIe République en France."],
    ["1905", "Loi de séparation des Églises et de l'État en France."],
    ["1946", "Création de la IVe République française."]
  ];

  const geoFacts = [
    ["espace productif", "Espace organisé pour produire des richesses : agriculture, industrie ou services."],
    ["aire urbaine", "Ensemble formé par un pôle urbain et sa couronne périurbaine."],
    ["métropolisation", "Concentration des populations, activités et pouvoirs dans les grandes villes."],
    ["aménagement du territoire", "Action visant à réduire les inégalités et organiser les espaces."],
    ["DROM", "Territoires ultramarins français avec contraintes d'éloignement et atouts stratégiques."],
    ["mobilités", "Déplacements de personnes, quotidiens ou à plus longue distance."],
    ["pôle urbain", "Ville-centre autour de laquelle s'organise une aire urbaine."],
    ["couronne périurbaine", "Espace périphérique d'une métropole où vivent des pendulaires."],
    ["fracture territoriale", "Inégalités fortes entre territoires dynamiques et territoires en difficulté."],
    ["désertification rurale", "Départ des habitants et des activités des campagnes."],
    ["réseau de transport", "Routes, voies ferrées, ports et aéroports qui relient les territoires."],
    ["zone industrialo-portuaire", "Espace productif lié aux activités portuaires et industrielles."],
    ["agriculture intensive", "Production agricole à haut rendement sur de grandes surfaces."],
    ["tourisme", "Activité économique liée à l'accueil des visiteurs sur un territoire."],
    ["énergie renouvelable", "Énergie produite à partir de sources naturelles renouvelables."],
    ["îlot de chaleur urbain", "Surélévation des températures au cœur des villes."],
    ["étalement urbain", "Extension des villes vers les espaces périurbains et ruraux."],
    ["ZAC", "Zone d'aménagement concerté pour restructurer un quartier ou un territoire."],
    ["littoral", "Bande de terre en bord de mer, souvent très urbanisée en France."],
    ["massif montagneux", "Espace de montagne avec contraintes d'accessibilité et atouts touristiques."],
    ["delta", "Embouchure d'un fleuve formée de bras et d'îles sédimentaires."],
    ["estuaire", "Partie d'un fleuve influencée par les marées près de la mer."],
    ["mégalopole", "Ensemble de métropoles reliées formant un grand corridor urbain."],
    ["périurbanisation", "Installation de populations en périphérie des villes."],
    ["gentrification", "Transformation d'un quartier populaire par l'arrivée de populations aisées."],
    ["inégalités territoriales", "Différences de richesse, d'emploi et de services entre territoires."],
    ["croquis", "Schéma géographique simplifié pour localiser des informations sur un territoire."],
    ["échelle", "Rapport entre une distance sur la carte et la distance réelle."],
    ["flux migratoire", "Mouvement de population d'un territoire vers un autre."],
    ["pendulaire", "Personne qui habite loin de son lieu de travail et fait la navette."]
  ];

  const historyCurated = [
    { topic: "WW2", prompt: "Quel événement marque le début de la Seconde Guerre mondiale en Europe ?", correct: "L'invasion de la Pologne par l'Allemagne", wrong: ["Le débarquement en Normandie", "L'armistice de 1918", "La chute du mur de Berlin"], explain: "1er septembre 1939 : l'Allemagne envahit la Pologne." },
    { topic: "WW2", prompt: "Que fit le général de Gaulle le 18 juin 1940 ?", correct: "Il appela à résister depuis Londres", wrong: ["Il signa l'armistice", "Il organisa le débarquement", "Il proclama la IVe République"], explain: "Appel du 18 juin 1940 : refus de l'armistice, naissance de la France libre." },
    { topic: "WW2", prompt: "Où et quand a lieu le débarquement allié en France ?", correct: "6 juin 1944 en Normandie", wrong: ["8 mai 1945 à Paris", "22 juin 1940 à Vichy", "11 novembre 1918 en Picardie"], explain: "Opération Overlord : tournant de la guerre en Europe occidentale." },
    { topic: "WW2", prompt: "Que commémore-t-on le 8 mai ?", correct: "La capitulation de l'Allemagne nazie en Europe", wrong: ["Le début de la guerre", "La prise de la Bastille", "La chute du mur de Berlin"], explain: "8 mai 1945 : fin de la Seconde Guerre mondiale en Europe." },
    { topic: "WW2", prompt: "Qu'est-ce que le régime de Vichy ?", correct: "L'État français dirigé par Pétain après l'armistice de 1940", wrong: ["Le gouvernement de la France libre", "L'occupation militaire directe de Paris", "La République après 1945"], explain: "22 juin 1940 : armistice et collaboration avec l'Allemagne." },
    { topic: "WW2", prompt: "Quelle organisation naît en 1945 pour maintenir la paix ?", correct: "L'ONU", wrong: ["L'OTAN", "La CEE", "L'URSS"], explain: "24 octobre 1945 : création des Nations unies." },
    { topic: "Guerre froide", prompt: "Quels événements marquent le début de la Guerre froide (1947) ?", correct: "Doctrine Truman et plan Marshall", wrong: ["Chute du mur de Berlin", "Débarquement en Normandie", "Crise des missiles de Cuba"], explain: "Division du monde en deux blocs Est/Ouest." },
    { topic: "Guerre froide", prompt: "À quoi correspond la date du 9 novembre 1989 ?", correct: "La chute du mur de Berlin", wrong: ["La construction du mur", "La fin de la Seconde Guerre mondiale", "Le début de la Guerre froide"], explain: "Symbole de la fin de la Guerre froide en Europe." },
    { topic: "Guerre froide", prompt: "Qu'est-ce que le rideau de fer ?", correct: "La séparation entre l'Europe capitaliste et l'Europe communiste", wrong: ["Un mur autour de Paris", "Une alliance militaire américaine", "Un traité de paix de 1918"], explain: "Expression de Churchill (1946) : division de l'Europe." },
    { topic: "Guerre froide", prompt: "Quel événement de 1962 a failli provoquer une guerre nucléaire ?", correct: "La crise des missiles de Cuba", wrong: ["Le blocus de Berlin", "La guerre du Vietnam", "Mai 68"], explain: "Affrontement États-Unis / URSS au plus fort de la Guerre froide." },
    { topic: "Repères", prompt: "Que commémore-t-on le 11 novembre ?", correct: "L'armistice de 1918 mettant fin à la Première Guerre mondiale", wrong: ["Le début de la Seconde Guerre mondiale", "La Révolution française", "La chute du mur de Berlin"], explain: "11 novembre 1918 : fin des combats de la Première Guerre mondiale." },
    { topic: "Repères", prompt: "Quelle date symbolise le début de la Révolution française ?", correct: "14 juillet 1789", wrong: ["4 août 1914", "18 juin 1940", "9 novembre 1989"], explain: "Prise de la Bastille." },
    { topic: "Repères", prompt: "En quelle année la Constitution de la Ve République est-elle promulguée ?", correct: "1958", wrong: ["1945", "1789", "1989"], explain: "1958 : début de la Ve République sous de Gaulle." },
    { topic: "Repères", prompt: "Quel traité crée la Communauté économique européenne en 1957 ?", correct: "Le traité de Rome", wrong: ["Le traité de Versailles", "Le plan Marshall", "Le traité de Maastricht"], explain: "1957 : début de la construction européenne." },
    { topic: "WW2", prompt: "Quelle est la « rafle du Vel d'Hiv » (1942) ?", correct: "L'arrestation de milliers de juifs à Paris par la police", wrong: ["Le débarquement allié", "La Libération de Paris", "L'appel du 18 juin"], explain: "Exemple de persécution des juifs sous l'Occupation." },
    { topic: "WW2", prompt: "Qui dirigeait l'Allemagne nazie pendant la Seconde Guerre mondiale ?", correct: "Adolf Hitler", wrong: ["Benito Mussolini", "Joseph Staline", "Charles de Gaulle"], explain: "Hitler chancelier en 1933, déclencheur de la guerre." },
    { topic: "WW2", prompt: "Quel pays attaque Pearl Harbor en 1941 ?", correct: "Le Japon", wrong: ["L'Allemagne", "L'Italie", "L'URSS"], explain: "Les États-Unis entrent en guerre après cette attaque." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'une aire urbaine au brevet ?", correct: "Un pôle urbain et sa couronne périurbaine liés", wrong: ["Une seule ville sans banlieue", "Un espace uniquement agricole", "Un territoire d'outre-mer"], explain: "Ville-centre + communes périphériques qui gravitent autour." },
    { topic: "Géographie", prompt: "Que désigne la métropolisation ?", correct: "La concentration des activités dans les grandes villes", wrong: ["L'extension des campagnes", "La disparition des ports", "L'isolement des DROM"], explain: "Les métropoles concentrent emplois, population et décisions." },
    { topic: "Géographie", prompt: "Quel est l'objectif principal de l'aménagement du territoire ?", correct: "Réduire les inégalités entre les territoires", wrong: ["Augmenter uniquement le tourisme", "Fermer les espaces ruraux", "Supprimer les transports"], explain: "Organiser le territoire pour corriger les déséquilibres." },
    { topic: "Géographie", prompt: "Quelle contrainte majeure rencontrent les DROM ?", correct: "L'éloignement et l'insularité", wrong: ["L'absence de population", "Le manque de mer", "L'isolement climatique uniquement"], explain: "DROM : territoires ultramarins avec atouts et contraintes." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'un espace productif ?", correct: "Un territoire organisé pour produire des richesses", wrong: ["Une zone sans activité humaine", "Un parc naturel protégé", "Un quartier résidentiel seul"], explain: "Agriculture, industrie ou services selon les ressources." },
    { topic: "Géographie", prompt: "Pourquoi étudie-t-on les mobilités au brevet ?", correct: "Pour comprendre les déplacements et leurs effets sur les territoires", wrong: ["Pour calculer des probabilités", "Pour apprendre l'allemand", "Pour étudier la physique"], explain: "Navettes domicile-travail, migrations, transports." },
    { topic: "WW2", prompt: "Quand la France est-elle libérée de l'occupation nazie ?", correct: "En 1944", wrong: ["En 1939", "En 1958", "En 1989"], explain: "Libération de Paris (août 1944) et avancée alliée." },
    { topic: "Guerre froide", prompt: "Qu'est-ce que le plan Marshall (1947) ?", correct: "Une aide économique américaine pour reconstruire l'Europe", wrong: ["Un plan d'invasion de l'URSS", "Un accord de paix avec l'Allemagne", "La création de l'euro"], explain: "Aide massive pour relancer l'Europe de l'Ouest." },
    { topic: "Guerre froide", prompt: "Quel mur symbolise la division de Berlin pendant la Guerre froide ?", correct: "Le mur de Berlin", wrong: ["La ligne Maginot", "Le mur des Lamentations", "Le rideau de fer physique"], explain: "Construit en 1961, tombé le 9 novembre 1989." },
    { topic: "Repères", prompt: "Quand l'Algérie devient-elle indépendante ?", correct: "1962", wrong: ["1954", "1945", "1989"], explain: "1962 : fin de la guerre d'Algérie et indépendance." },
    { topic: "Repères", prompt: "Quelle loi française de 1905 est importante en EMC et en histoire ?", correct: "La loi de séparation des Églises et de l'État", wrong: ["La loi sur le vote des femmes", "La Constitution de 1958", "Le code civil de 1804"], explain: "Fondement de la laïcité à l'école." },
    { topic: "WW2", prompt: "Quel terme désigne la résistance française depuis Londres ?", correct: "La France libre", wrong: ["Le régime de Vichy", "L'Occupation", "La IIIe République"], explain: "De Gaulle dirige la France libre à partir de 1940." },
    { topic: "WW2", prompt: "Quelle bataille de 1943 marque un tournant à l'Est en Europe ?", correct: "La bataille de Stalingrad", wrong: ["La bataille de Verdun", "La bataille de Marignan", "Waterloo"], explain: "Défaite majeure de l'Allemagne face à l'URSS." },
    { topic: "WW2", prompt: "Pourquoi les États-Unis entrent-ils en guerre en 1941 ?", correct: "À cause de l'attaque japonaise sur Pearl Harbor", wrong: ["À cause du débarquement en Normandie", "À cause de l'invasion de la Pologne", "À cause de la chute de Berlin"], explain: "Le Japon attaque la base américaine de Pearl Harbor." },
    { topic: "WW2", prompt: "Que signifie « Collaboration » pendant l'Occupation ?", correct: "La coopération du régime de Vichy avec l'Allemagne nazie", wrong: ["L'aide des Alliés à la France", "La Résistance intérieure", "Le plan Marshall"], explain: "Politique de Pétain avec l'occupant nazi." },
    { topic: "WW2", prompt: "Quel événement est célébré chaque 14 juillet ?", correct: "La prise de la Bastille en 1789", wrong: ["L'armistice de 1918", "Le débarquement de 1944", "La chute du mur de Berlin"], explain: "Fête nationale française." },
    { topic: "Guerre froide", prompt: "Quels pays dominent les deux blocs de la Guerre froide ?", correct: "Les États-Unis et l'URSS", wrong: ["La France et l'Allemagne", "Le Royaume-Uni et le Japon", "La Chine et l'Inde"], explain: "Bipolarisation du monde après 1945." },
    { topic: "Guerre froide", prompt: "Qu'est-ce que l'OTAN créée en 1949 ?", correct: "Une alliance militaire occidentale", wrong: ["Un plan d'aide économique", "Un accord commercial", "L'armée française seule"], explain: "Organisation du traité de l'Atlantique Nord." },
    { topic: "Guerre froide", prompt: "Quel conflit oppose les États-Unis et l'URSS par pays interposés en Corée ?", correct: "La guerre de Corée (1950-1953)", wrong: ["La guerre du Golfe", "La guerre de Crimée seule", "La guerre d'Algérie"], explain: "Premier grand conflit armé de la Guerre froide." },
    { topic: "Guerre froide", prompt: "Qu'est-ce que le bloc de l'Est ?", correct: "Les pays européens sous influence soviétique", wrong: ["Les démocraties occidentales", "Les colonies africaines françaises", "Les États-Unis"], explain: "Europe de l'Est communiste après 1945." },
    { topic: "Repères", prompt: "Quand débute la Première Guerre mondiale pour la France ?", correct: "4 août 1914", wrong: ["11 novembre 1918", "1er septembre 1939", "18 juin 1940"], explain: "La France entre en guerre après la mobilisation." },
    { topic: "Repères", prompt: "Quel traité met fin à la Première Guerre mondiale en 1919 ?", correct: "Le traité de Versailles", wrong: ["Le traité de Rome", "Le traité de Yalta", "Le traité de Paris de 1947"], explain: "Paix signée avec l'Allemagne vaincue." },
    { topic: "Repères", prompt: "Quelle république française est proclamée en 1871 ?", correct: "La IIIe République", wrong: ["La Ve République", "La IVe République", "La monarchie"], explain: "Régime qui dure jusqu'en 1940." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'un croquis au brevet de géographie ?", correct: "Un schéma simplifié pour localiser des informations", wrong: ["Un tableau de données", "Une rédaction longue", "Un exercice de maths"], explain: "Légendé, orienté, avec une échelle." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'une fracture territoriale en France ?", correct: "De fortes inégalités entre territoires dynamiques et en difficulté", wrong: ["Un tremblement de terre", "Une frontière avec l'Allemagne", "Un mur entre deux villes"], explain: "Ex : métropoles riches vs espaces ruraux fragiles." },
    { topic: "Géographie", prompt: "Qu'est-ce que la périurbanisation ?", correct: "L'installation de populations en périphérie des villes", wrong: ["La fermeture des villes", "La disparition des transports", "L'urbanisation du Sahara"], explain: "Habitat en couronne autour des métropoles." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'un flux migratoire ?", correct: "Un déplacement de population d'un territoire vers un autre", wrong: ["Un courant électrique", "Un fleuve", "Un type de vent"], explain: "Migrations liées au travail, aux études, etc." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'un pendulaire ?", correct: "Une personne qui habite loin de son lieu de travail", wrong: ["Un migrant international", "Un retraité", "Un agriculteur"], explain: "Navette quotidienne domicile-travail." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'un littoral en géographie ?", correct: "La bande de terre en bord de mer", wrong: ["Un sommet montagneux", "Un désert", "Une forêt"], explain: "Espace souvent très urbanisé et touristique." },
    { topic: "WW2", prompt: "Quelle ville française est libérée en août 1944 ?", correct: "Paris", wrong: ["Berlin", "Londres", "Moscou"], explain: "Libération de Paris le 25 août 1944." },
    { topic: "WW2", prompt: "Quel dictateur italien s'allie à Hitler ?", correct: "Benito Mussolini", wrong: ["Staline", "Churchill", "Roosevelt"], explain: "L'Italie fasciste alliée de l'Allemagne nazie." },
    { topic: "Guerre froide", prompt: "Qu'est-ce que la doctrine Truman (1947) ?", correct: "Une politique d'endiguement du communisme", wrong: ["Un plan d'aide européen", "La construction du mur de Berlin", "La création de l'ONU"], explain: "Les États-Unis cherchent à limiter l'expansion soviétique." },
    { topic: "Guerre froide", prompt: "Quand l'URSS disparaît-elle ?", correct: "1991", wrong: ["1989", "1945", "2001"], explain: "Fin officielle de l'Union soviétique." },
    { topic: "Repères", prompt: "Quel événement de Mai 68 se déroule en France ?", correct: "Un mouvement social et étudiant majeur", wrong: ["Le débarquement en Normandie", "La chute du mur", "La guerre d'Algérie"], explain: "Crise politique et sociale en France." },
    { topic: "Repères", prompt: "Quelle catastrophe nucléaire a lieu en 1986 ?", correct: "Tchernobyl", wrong: ["Fukushima seule", "Hiroshima en guerre", "Three Mile Island uniquement"], explain: "Catastrophe en Ukraine (URSS)." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'une ZAC ?", correct: "Une zone d'aménagement concerté", wrong: ["Une zone agricole protégée", "Une zone sans habitants", "Un parc national"], explain: "Projet pour restructurer un quartier ou territoire." },
    { topic: "Géographie", prompt: "Qu'est-ce qu'un espace productif agricole ?", correct: "Un territoire organisé pour produire des récoltes ou élevage", wrong: ["Une zone sans agriculture", "Un centre commercial", "Un stade"], explain: "Grandes cultures, élevage, viticulture…" },
    { topic: "Géographie", prompt: "Qu'est-ce qu'une mégalopole ?", correct: "Un ensemble de métropoles reliées", wrong: ["Un petit village", "Une seule ferme", "Un océan"], explain: "Ex : dorsale européenne London-Paris-Rhin." },
    { topic: "WW2", prompt: "Que fut l'Holocauste pendant la Shoah ?", correct: "L'extermination systématique des juifs par le nazisme", wrong: ["Une bataille navale", "Un traité de paix", "Une réforme scolaire"], explain: "Crime contre l'humanité pendant la WW2." },
    { topic: "WW2", prompt: "Quel pays est occupé par l'Allemagne en 1940 ?", correct: "La France", wrong: ["Les États-Unis", "Le Royaume-Uni", "Le Japon"], explain: "Occupation du nord et de l'ouest de la France." }
  ];

  const emcFacts = [
    ["laïcité", "Neutralité de l'État et liberté de conscience."],
    ["citoyen", "Personne qui possède des droits politiques et participe à la vie démocratique."],
    ["démocratie", "Régime où la souveraineté appartient au peuple."],
    ["discrimination", "Traitement défavorable interdit par la loi sur un critère précis."],
    ["liberté d'expression", "Droit d'exprimer ses idées dans les limites fixées par la loi."],
    ["Constitution", "Texte qui organise les pouvoirs et garantit les droits fondamentaux."],
    ["séparation des pouvoirs", "Répartition du pouvoir législatif, exécutif et judiciaire."],
    ["suffrage universel", "Droit de vote accordé à tous les citoyens majeurs."],
    ["parlement", "Assemblée qui vote les lois et contrôle le gouvernement."],
    ["gouvernement", "Organe qui dirige l'action de l'État au quotidien."],
    ["président de la République", "Chef de l'État élu au suffrage universel direct."],
    ["député", "Représentant élu à l'Assemblée nationale."],
    ["sénateur", "Représentant élu au Sénat."],
    ["égalité", "Principe selon lequel tous les citoyens ont les mêmes droits devant la loi."],
    ["fraternité", "Solidarité entre les membres d'une société."],
    ["engagement citoyen", "Participation active à la vie collective et démocratique."],
    ["médias", "Presse, radio, télévision et internet : sources d'information à analyser."],
    ["fake news", "Fausses informations diffusées volontairement ou par erreur."],
    ["intégration", "Processus par lequel une personne participe pleinement à la société."],
    ["diversité culturelle", "Coexistence de cultures différentes dans une même société."],
    ["DDH", "Déclaration des droits de l'homme et du citoyen de 1789."],
    ["droits de l'enfant", "Droits fondamentaux reconnus à tout enfant."],
    ["devoirs civiques", "Obligations des citoyens : respect des lois, impôts, défense."],
    ["vote", "Acte par lequel un citoyen choisit ses représentants."],
    ["abstention", "Ne pas aller voter lors d'une élection."],
    ["parti politique", "Organisation qui défend un programme et présente des candidats."],
    ["lobby", "Groupe de pression qui cherche à influencer les décisions politiques."],
    ["ONG", "Organisation non gouvernementale d'aide humanitaire ou de défense de causes."],
    ["justice", "Institution qui applique la loi et tranche les litiges."],
    ["présomption d'innocence", "Toute personne est considérée innocente tant qu'elle n'est pas condamnée."],
    ["égalité femmes-hommes", "Principe constitutionnel de non-discrimination entre les sexes."],
    ["harcèlement", "Comportements répétés hostiles ou humiliants envers une personne."],
    ["cyberharcèlement", "Harcèlement exercé via internet ou les réseaux sociaux."],
    ["respect", "Valeur fondamentale dans les relations entre citoyens."],
    ["tolérance", "Acceptation des différences et des opinions d'autrui."],
    ["solidarité", "Entraide entre les membres d'une communauté."],
    ["écologie", "Prise en compte de l'environnement dans les choix de société."],
    ["développement durable", "Développement qui répond aux besoins du présent sans compromettre l'avenir."],
    ["économie sociale et solidaire", "Entreprises à finalité sociale ou environnementale."],
    ["bénévolat", "Activité non rémunérée au service d'autrui ou de l'intérêt général."],
    ["République", "Régime où le chef de l'État n'est pas un roi."],
    ["régime parlementaire", "Système où le gouvernement dépend de la confiance du Parlement."],
    ["régime présidentiel", "Système où le Président a un pouvoir exécutif fort."],
    ["collectivité territoriale", "Commune, département ou région : échelon local de décision."],
    ["maire", "Élu qui dirige une commune."],
    ["préfet", "Représentant de l'État dans un département."],
    ["élection", "Consultation des citoyens pour choisir des représentants."],
    ["référendum", "Vote du peuple sur une question précise."],
    ["pétition", "Texte signé par des citoyens pour demander une action."],
    ["manifestation", "Rassemblement public pour exprimer une opinion."],
    ["grève", "Arrêt collectif du travail pour faire pression."],
    ["syndicat", "Organisation qui défend les salariés."],
    ["association", "Groupe d'intérêt général ou culturel à but non lucratif."],
    ["entreprise", "Organisation économique qui produit des biens ou services."],
    ["marché", "Lieu d'échange de biens et services."],
    ["impôt", "Contribution obligatoire des citoyens au financement de l'État."],
    ["budget", "Prévision des dépenses et recettes d'une collectivité ou de l'État."],
    ["service public", "Activité assurée par l'État ou une collectivité pour tous."],
    ["privé", "Secteur géré par des entreprises et non par l'État."],
    ["nationalité", "Lien juridique et politique qui unit un individu à un État."],
    ["passeport", "Document officiel d'identité pour voyager à l'étranger."],
    ["carte d'identité", "Document qui prouve l'identité d'une personne."],
    ["recensement", "Opération qui compte la population d'un pays."],
    ["immigration", "Installation durable de personnes venant de l'étranger."],
    ["émigration", "Départ durable de personnes vers un autre pays."],
    ["intégration républicaine", "Adhésion aux valeurs et règles de la République."],
    ["radicalisation", "Adoption de positions extrêmes pouvant mener à la violence."],
    ["terrorisme", "Violence organisée visant à semer la peur dans la population."],
    ["état d'urgence", "Régime temporaire avec des pouvoirs renforcés pour faire face à une crise."],
    ["défenseur des droits", "Autorité indépendante qui protège les droits des citoyens."],
    ["Cour européenne des droits de l'homme", "Tribunal qui veille au respect des droits fondamentaux en Europe."],
    ["ONU", "Organisation des Nations unies pour la paix et la coopération internationale."],
    ["Union européenne", "Organisation de pays européens partageant des règles communes."],
    ["traité", "Accord officiel entre États ou organisations."],
    ["protocole", "Accord complémentaire à un traité."],
    ["amendement", "Modification proposée à un texte de loi."],
    ["loi", "Règle votée par le Parlement et applicable à tous."],
    ["décret", "Texte pris par le pouvoir exécutif pour appliquer les lois."],
    ["règlement", "Norme qui s'applique dans une organisation ou une école."],
    ["sanction", "Punition prévue en cas de non-respect d'une règle."],
    ["contrat", "Accord entre deux parties qui créent des obligations."],
    ["consentement", "Accord libre et éclairé d'une personne."],
    ["secret professionnel", "Obligation de ne pas divulguer certaines informations."],
    ["vie privée", "Droit de garder certaines informations personnelles confidentielles."],
    ["données personnelles", "Informations permettant d'identifier une personne."],
    ["RGPD", "Règlement européen sur la protection des données personnelles."],
    ["identité numérique", "Empreinte laissée par une personne sur internet."],
    ["trace numérique", "Données enregistrées lors de l'utilisation d'internet."],
    ["cybersécurité", "Protection des systèmes informatiques contre les attaques."],
    ["phishing", "Tentative de vol de données par un faux message."],
    ["arnaque en ligne", "Escroquerie réalisée via internet."],
    ["signalement", "Déclaration d'un contenu illicite ou dangereux aux autorités."],
    ["numéro d'urgence", "17 police, 18 pompiers, 15 SAMU, 112 numéro européen."],
    ["pacte républicain", "Ensemble de principes partagés à l'école de la République."]
  ];

  function buildFrenchItems() {
    const base = [
      { topic: "Homophones", q: "Complète : il ___ révisé ses formules.", answers: ["a", "à", "as", "ha"], correct: "a", explain: "On peut remplacer par « avait » : il avait révisé." },
      { topic: "Accords", q: "Quelle phrase est correctement accordée ?", answers: ["Les copies sont corrigé.", "Les copies sont corrigées.", "Les copies est corrigées.", "Les copie sont corrigées."], correct: "Les copies sont corrigées.", explain: "Le participe passé employé avec être s'accorde avec le sujet « copies »." },
      { topic: "Valeurs des temps", q: "Dans « Il marchait quand l'orage éclata », l'imparfait exprime...", answers: ["une action de premier plan", "une action d'arrière-plan", "un ordre", "une hypothèse"], correct: "une action d'arrière-plan", explain: "L'imparfait installe le décor ; le passé simple marque l'événement." },
      { topic: "Réécriture", q: "Transforme au pluriel : « Ce cheval rapide franchit l'obstacle. »", answers: ["Ces chevaux rapides franchissent l'obstacle.", "Ces cheval rapides franchit l'obstacle.", "Ce chevaux rapide franchissent l'obstacle.", "Ces chevaux rapide franchit l'obstacle."], correct: "Ces chevaux rapides franchissent l'obstacle.", explain: "Ce → ces, cheval → chevaux, rapide → rapides, franchit → franchissent." },
      { topic: "Argumentation", q: "Dans un paragraphe argumenté, l'exemple sert surtout à...", answers: ["décorer la copie", "prouver et préciser l'idée", "remplacer la thèse", "allonger sans raison"], correct: "prouver et préciser l'idée", explain: "Une idée solide s'appuie sur un exemple précis." },
      { topic: "Compréhension", q: "Pour justifier une réponse sur un texte, il faut d'abord...", answers: ["citer ou reformuler un indice précis", "donner son avis seulement", "écrire plus long", "changer de sujet"], correct: "citer ou reformuler un indice précis", explain: "La justification doit venir du texte ou de l'image." },
      { topic: "Connecteurs", q: "Quel connecteur exprime une opposition ?", answers: ["car", "cependant", "donc", "puis"], correct: "cependant", explain: "« Cependant » introduit une idée qui s'oppose à la précédente." },
      { topic: "Pluriel", q: "Le pluriel de « journal » est...", answers: ["journaus", "journaux", "journalx", "journale"], correct: "journaux", explain: "Les mots en -al font souvent leur pluriel en -aux." }
    ];

    const homophoneVerbs = ["révisé", "terminé", "compris", "fini", "lu", "écrit", "appris", "travaillé", "réussi", "préparé"];
    homophoneVerbs.forEach((verb) => {
      base.push({
        topic: "Homophones",
        q: `Complète : il ___ ${verb} la leçon.`,
        answers: ["a", "à", "as", "ha"],
        correct: "a",
        explain: `On peut remplacer par « avait » : il avait ${verb} la leçon.`
      });
    });

    const aVerbs = ["réviser", "travailler", "comprendre", "réussir", "progresser", "apprendre", "écrire", "lire"];
    aVerbs.forEach((verb) => {
      base.push({
        topic: "Homophones",
        q: `Complète : il faut ___ ${verb} avant le brevet.`,
        answers: ["à", "a", "as", "ah"],
        correct: "à",
        explain: "« À » est une préposition devant un infinitif."
      });
    });

    const pluralNouns = [
      ["journal", "journaux"], ["cheval", "chevaux"], ["travail", "travaux"], ["animal", "animaux"],
      ["bateau", "bateaux"], ["château", "châteaux"], ["oiseau", "oiseaux"], ["jeu", "jeux"],
      ["lieu", "lieux"], ["feu", "feux"], ["bijou", "bijoux"], ["caillou", "cailloux"],
      ["travail", "travaux"], ["vitrail", "vitraux"], ["corail", "coraux"], ["émail", "émaux"]
    ];
    pluralNouns.forEach(([sing, plur]) => {
      base.push({
        topic: "Pluriel",
        q: `Le pluriel de « ${sing} » est...`,
        answers: [plur, `${sing}s`, `${sing}x`, `${plur}e`],
        correct: plur,
        explain: `Le pluriel correct de « ${sing} » est « ${plur} ».`
      });
    });

    const connecteurs = [
      ["opposition", "cependant", ["car", "donc", "puis"]],
      ["cause", "car", ["cependant", "donc", "ensuite"]],
      ["conséquence", "donc", ["cependant", "car", "mais"]],
      ["addition", "de plus", ["cependant", "car", "néanmoins"]],
      ["conclusion", "en conclusion", ["car", "puis", "cependant"]]
    ];
    connecteurs.forEach(([role, correct, wrong]) => {
      base.push({
        topic: "Connecteurs",
        q: `Quel connecteur exprime une ${role} ?`,
        answers: [correct, ...wrong],
        correct,
        explain: `« ${correct} » exprime une ${role}.`
      });
    });

    const temps = [
      ["imparfait", "une action d'arrière-plan ou une habitude", ["un événement ponctuel", "un ordre", "une certitude"]],
      ["passé simple", "un événement ponctuel du passé", ["une description", "une habitude", "un souhait"]],
      ["présent", "une action qui se déroule maintenant", ["un souvenir lointain", "un ordre passé", "une hypothèse"]],
      ["futur simple", "une action à venir", ["un regret", "une habitude passée", "une description"]]
    ];
    temps.forEach(([tempsName, correct, wrong]) => {
      base.push({
        topic: "Valeurs des temps",
        q: `Le ${tempsName} sert surtout à exprimer...`,
        answers: [correct, ...wrong],
        correct,
        explain: `Le ${tempsName} : ${correct}.`
      });
    });

    const ouOu = [
      ["Tu veux du thé ___ du café ?", "ou", "« Ou » exprime un choix."],
      ["La ville ___ il habite est grande.", "où", "« Où » est un pronom relatif de lieu."],
      ["Veux-tu partir maintenant ___ plus tard ?", "ou", "« Ou » présente une alternative."],
      ["Le pays ___ elle est née est le Maroc.", "où", "« Où » remplace un complément de lieu."]
    ];
    ouOu.forEach(([sentence, correct, explain]) => {
      base.push({ topic: "Homophones", q: `Complète : ${sentence}`, answers: [correct, correct === "ou" ? "où" : "ou", "o", "oû"], correct, explain });
    });

    const estSont = [
      ["Les élèves ___ en cours.", "sont", "Sujet pluriel → « sont »."],
      ["Il ___ très concentré.", "est", "Sujet singulier → « est »."],
      ["Nous ___ prêts pour l'examen.", "sommes", "Verbe être à la 1re personne du pluriel."],
      ["Tu ___ en retard.", "es", "Verbe être à la 2e personne du singulier."]
    ];
    estSont.forEach(([sentence, correct, explain]) => {
      const wrong = ["est", "sont", "es", "sommes"].filter((w) => w !== correct);
      base.push({ topic: "Conjugaison", q: `Complète : ${sentence}`, answers: [correct, ...wrong.slice(0, 3)], correct, explain });
    });

    const figures = [
      ["« La mer gronde »", "personnification", ["comparaison", "hyperbole", "énumération"], "On donne une action humaine à la mer."],
      ["« Brave comme un lion »", "comparaison", ["métaphore", "ironie", "litote"], "Comparaison avec « comme »."],
      ["« Une mer de nuages »", "métaphore", ["comparaison", "hyperbole", "anaphore"], "Image sans mot de comparaison."],
      ["« Jamais, jamais, jamais »", "anaphore", ["litote", "gradation", "antithèse"], "Répétition d'un mot en début de phrase."],
      ["« Il n'est pas mauvais » (pour dire qu'il est bon)", "litote", ["hyperbole", "ironie", "métaphore"], "On affaiblit la négation pour insister."],
      ["« Un million de fois »", "hyperbole", ["litote", "comparaison", "énumération"], "Exagération volontaire."]
    ];
    figures.forEach(([phrase, correct, wrong, explain]) => {
      base.push({ topic: "Figures de style", q: `Quelle figure de style dans « ${phrase} » ?`, answers: [correct, ...wrong], correct, explain });
    });

    const typesPhrases = [
      ["« Ferme la porte ! »", "impérative", ["déclarative", "interrogative", "exclamative"], "Ordre ou conseil : phrase impérative."],
      ["« Quelle heure est-il ? »", "interrogative", ["déclarative", "impérative", "exclamative"], "Question directe."],
      ["« Quelle belle journée ! »", "exclamative", ["déclarative", "interrogative", "impérative"], "Émotion marquée par « ! »."],
      ["« Le brevet approche. »", "déclarative", ["interrogative", "impérative", "exclamative"], "Phrase qui énonce un fait." ]
    ];
    typesPhrases.forEach(([phrase, correct, wrong, explain]) => {
      base.push({ topic: "Grammaire", q: `Quel type de phrase : « ${phrase} » ?`, answers: [correct, ...wrong], correct, explain });
    });

    return base;
  }

  function makeFrenchAccordQuestion() {
    const subjects = [
      ["Les filles", "féminin pluriel", "es"],
      ["La copie", "féminin singulier", "e"],
      ["Les garçons", "masculin pluriel", "s"],
      ["Le devoir", "masculin singulier", ""],
      ["Mes amies", "féminin pluriel", "es"],
      ["Les lettres", "féminin pluriel", "es"],
      ["Un message", "masculin singulier", ""],
      ["Des exercices", "masculin pluriel", "s"]
    ];
    const participes = ["parti", "arrivé", "sorti", "entré", "monté", "descendu", "venu", "allé", "né", "mort", "resté", "tombé"];
    const [sujet, accord, suffix] = choice(subjects);
    const pp = choice(participes);
    const correct = `${sujet} ${pp}${suffix}.`;
    const wrong1 = `${sujet} ${pp}.`;
    const wrong2 = `${sujet} est ${pp}${suffix === "s" ? "e" : "s"}.`;
    const wrong3 = `${sujet.replace("Les", "Le")} ${pp}${suffix}.`;
    return q("Français", "Accords", `Quelle phrase est correctement accordée avec « être » ?`, correct, [wrong1, wrong2, wrong3], `Avec « être », le participe passé s'accorde : ${accord}.`);
  }

  function makeFrenchAvoirQuestion() {
    const aux = choice(["a", "ont", "as", "avez"]);
    const verbes = ["mangé", "bu", "pris", "fait", "dit", "écrit", "lu", "vu", "su", "voulu"];
    const v = choice(verbes);
    const withCOD = Math.random() > 0.5;
    if (withCOD) {
      const codFemPl = choice(["les pommes", "les leçons", "les copies", "les réponses"]);
      const correct = `${codFemPl} qu'il a ${v}es`;
      const wrong = [`${codFemPl} qu'il a ${v}`, `${codFemPl} qu'il a ${v}s`, `${codFemPl} qu'il ont ${v}es`];
      return q("Français", "Accords", `Quelle forme est correcte ?`, correct, wrong, "Avec « avoir », le participe passé s'accorde avec le COD placé avant.");
    }
    const sujet = aux === "a" ? "Il" : aux === "ont" ? "Ils" : aux === "as" ? "Tu" : "Vous";
    const correct = `${sujet} ${aux} ${v}.`;
    const wrong = [`${sujet} ${aux} ${v}e.`, `${sujet} ${aux} ${v}s.`, `${sujet} est ${v}.`];
    return q("Français", "Accords", `Quelle phrase est correcte avec « avoir » ?`, correct, wrong, "Avec « avoir », le participe passé ne s'accorde pas si le COD est après.");
  }

  function makeFrenchConjugaison() {
    const groups = [
      ["finir", "nous", "finissons", ["finissent", "finissez", "finis"]],
      ["prendre", "ils", "prennent", ["prenons", "prenez", "prenne"]],
      ["voir", "je", "vois", ["voit", "voyons", "voient"]],
      ["écrire", "tu", "écris", ["écrit", "écrivez", "écrivent"]],
      ["lire", "elle", "lit", ["lis", "lisons", "lisez"]],
      ["dire", "nous", "disons", ["dites", "disent", "dit"]],
      ["mettre", "vous", "mettez", ["met", "mettons", "mettent"]],
      ["partir", "ils", "partent", ["partons", "partez", "parte"]]
    ];
    const [verb, pers, correct, wrong] = choice(groups);
    return q("Français", "Conjugaison", `Quelle est la bonne conjugaison de « ${verb} » à la forme « ${pers} » ?`, correct, wrong, `${pers} + ${verb} → ${correct}.`);
  }

  function makeFrenchReecriture() {
    const sing = [
      ["Ce garçon attentif écoute.", "Ces garçons attentifs écoutent."],
      ["Cette règle importante aide.", "Ces règles importantes aident."],
      ["Ce devoir difficile inquiète.", "Ces devoirs difficiles inquiètent."],
      ["Cette fille studieuse réussit.", "Ces filles studieuses réussissent."],
      ["Ce professeur patient explique.", "Ces professeurs patients expliquent."],
      ["Cette leçon claire rassure.", "Ces leçons claires rassurent."],
      ["Ce résultat excellent motive.", "Ces résultats excellents motivent."],
      ["Cette épreuve longue fatigue.", "Ces épreuves longues fatiguent."]
    ];
    const [s, p] = choice(sing);
    const wrong = [
      s.replace("Ce", "Ces").replace("écoute", "écoutent"),
      p.replace("écoutent", "écoute").replace("Ces", "Ce"),
      p.replace("attentifs", "attentif")
    ].filter((w) => w !== p);
    return q("Français", "Réécriture", `Quelle phrase est la version correcte au pluriel de « ${s} » ?`, p, wrong.slice(0, 3), `Pluriel : ${p}`);
  }

  function makeFrenchNatureMot() {
    const mots = [
      ["rapidement", "adverbe", ["nom", "verbe", "adjectif"], "Terminaison en -ment → adverbe."],
      ["courageux", "adjectif", ["adverbe", "verbe", "pronom"], "Qualifie un nom → adjectif."],
      ["courir", "verbe", ["nom", "adjectif", "déterminant"], "Action → verbe."],
      ["liberté", "nom", ["verbe", "adjectif", "conjonction"], "Chose ou idée → nom."],
      ["nous", "pronom", ["adverbe", "nom", "préposition"], "Remplace un nom → pronom."],
      ["mais", "conjonction", ["adverbe", "nom", "interjection"], "Relie deux propositions → conjonction."],
      ["sous", "préposition", ["adverbe", "verbe", "nom"], "Introduit un complément → préposition."],
      ["belle", "adjectif", ["adverbe", "verbe", "nom"], "Accord avec un nom féminin → adjectif."],
      ["hier", "adverbe", ["nom", "verbe", "adjectif"], "Indique le temps → adverbe."],
      ["chaque", "déterminant", ["verbe", "pronom personnel", "conjonction"], "Précède un nom → déterminant."]
    ];
    const [mot, correct, wrong, explain] = choice(mots);
    return q("Français", "Grammaire", `Quelle est la nature du mot « ${mot} » ?`, correct, wrong, explain);
  }

  function makeFrenchOrthographe() {
    const mots = [
      ["acceuillir", "accueillir", ["acceuilir", "accuillir", "accueilir"], "Double c et double l : accueillir."],
      ["aparaitre", "apparaître", ["aparêtre", "apparaitre", "aparaître"], "Verbe en -aître : apparaître."],
      ["bibliotèque", "bibliothèque", ["biblioteque", "bibliotéque", "bibliothéque"], "Avec th : bibliothèque."],
      ["connaitre", "connaître", ["connaite", "conaitre", "connâitre"], "Verbe en -aître : connaître."],
      ["developpement", "développement", ["dévelopement", "developement", "développemant"], "Avec accent et deux p."],
      ["exigeance", "exigence", ["exigance", "exigeence", "exigense"], "Nom en -ence : exigence."],
      ["language", "langage", ["langauge", "languege", "langaj"], "Pas de n : langage."],
      ["parmis", "parmi", ["par mi", "parmit", "parmie"], "Sans s final : parmi."],
      ["succession", "succession", ["sucession", "succéssion", "sucsession"], "Double c et double s."],
      ["température", "température", ["température", "temparature", "températture"], "Avec accent aigu sur le e." ]
    ];
    const [wrongForm, correct, wrong, explain] = choice(mots);
    if (wrongForm === correct) {
      const alts = ["temparature", "températture", "températuree"];
      return q("Français", "Orthographe", `Quelle orthographe est correcte pour désigner la chaleur d'un corps ?`, correct, alts, explain);
    }
    return q("Français", "Orthographe", `Quelle orthographe est correcte ?`, correct, [wrongForm, ...wrong].filter((w) => w !== correct).slice(0, 3), explain);
  }

  function buildVerbConjugations() {
    const table = [];
    const verbs = [
      ["être", ["je suis", "tu es", "il est", "nous sommes", "vous êtes", "ils sont"]],
      ["avoir", ["j'ai", "tu as", "il a", "nous avons", "vous avez", "ils ont"]],
      ["aller", ["je vais", "tu vas", "il va", "nous allons", "vous allez", "ils vont"]],
      ["faire", ["je fais", "tu fais", "il fait", "nous faisons", "vous faites", "ils font"]],
      ["dire", ["je dis", "tu dis", "il dit", "nous disons", "vous dites", "ils disent"]],
      ["pouvoir", ["je peux", "tu peux", "il peut", "nous pouvons", "vous pouvez", "ils peuvent"]],
      ["vouloir", ["je veux", "tu veux", "il veut", "nous voulons", "vous voulez", "ils veulent"]],
      ["voir", ["je vois", "tu vois", "il voit", "nous voyons", "vous voyez", "ils voient"]],
      ["prendre", ["je prends", "tu prends", "il prend", "nous prenons", "vous prenez", "ils prennent"]],
      ["venir", ["je viens", "tu viens", "il vient", "nous venons", "vous venez", "ils viennent"]],
      ["écrire", ["j'écris", "tu écris", "il écrit", "nous écrivons", "vous écrivez", "ils écrivent"]],
      ["lire", ["je lis", "tu lis", "il lit", "nous lisons", "vous lisez", "ils lisent"]],
      ["mettre", ["je mets", "tu mets", "il met", "nous mettons", "vous mettez", "ils mettent"]],
      ["partir", ["je pars", "tu pars", "il part", "nous partons", "vous partez", "ils partent"]],
      ["sortir", ["je sors", "tu sors", "il sort", "nous sortons", "vous sortez", "ils sortent"]],
      ["finir", ["je finis", "tu finis", "il finit", "nous finissons", "vous finissez", "ils finissent"]],
      ["réussir", ["je réussis", "tu réussis", "il réussit", "nous réussissons", "vous réussissez", "ils réussissent"]],
      ["choisir", ["je choisis", "tu choisis", "il choisit", "nous choisissons", "vous choisissez", "ils choisissent"]],
      ["travailler", ["je travaille", "tu travailles", "il travaille", "nous travaillons", "vous travaillez", "ils travaillent"]],
      ["réviser", ["je révise", "tu révises", "il révise", "nous révisons", "vous révisez", "ils révisent"]],
      ["comprendre", ["je comprends", "tu comprends", "il comprend", "nous comprenons", "vous comprenez", "ils comprennent"]],
      ["apprendre", ["j'apprends", "tu apprends", "il apprend", "nous apprenons", "vous apprenez", "ils apprennent"]],
      ["attendre", ["j'attends", "tu attends", "il attend", "nous attendons", "vous attendez", "ils attendent"]],
      ["répondre", ["je réponds", "tu réponds", "il répond", "nous répondons", "vous répondez", "ils répondent"]],
      ["entendre", ["j'entends", "tu entends", "il entend", "nous entendons", "vous entendez", "ils entendent"]],
      ["perdre", ["je perds", "tu perds", "il perd", "nous perdons", "vous perdez", "ils perdent"]],
      ["vendre", ["je vends", "tu vends", "il vend", "nous vendons", "vous vendez", "ils vendent"]],
      ["jouer", ["je joue", "tu joues", "il joue", "nous jouons", "vous jouez", "ils jouent"]],
      ["manger", ["je mange", "tu manges", "il mange", "nous mangeons", "vous mangez", "ils mangent"]],
      ["commencer", ["je commence", "tu commences", "il commence", "nous commençons", "vous commencez", "ils commencent"]],
      ["étudier", ["j'étudie", "tu étudies", "il étudie", "nous étudions", "vous étudiez", "ils étudient"]]
    ];
    const persons = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];
    verbs.forEach(([inf, forms]) => {
      forms.forEach((correct, i) => {
        const wrong = shuffle(forms.filter((f) => f !== correct)).slice(0, 3);
        table.push({
          topic: "Conjugaison",
          q: `Quelle est la bonne conjugaison de « ${inf} » à la forme « ${persons[i]} » ?`,
          correct,
          answers: [correct, ...wrong],
          explain: `${persons[i]} + ${inf} → ${correct}.`
        });
      });
    });
    return table;
  }

  const verbConjugations = buildVerbConjugations();

  function makeFrenchVerbTable() {
    const item = choice(verbConjugations);
    return q("Français", item.topic, item.q, item.correct, item.answers.filter((a) => a !== item.correct), item.explain);
  }

  function makeFrenchSynonyme() {
    const paires = [
      ["rapide", "vite", ["lent", "lourd", "faible"]],
      ["difficile", "ardu", ["facile", "simple", "léger"]],
      ["commencer", "débuter", ["finir", "terminer", "cesser"]],
      ["regarder", "observer", ["ignorer", "cacher", "fuir"]],
      ["parler", "s'exprimer", ["se taire", "crier seul", "murmurer"]],
      ["beau", "magnifique", ["laid", "terne", "moche"]],
      ["peur", "crainte", ["courage", "audace", "calme"]],
      ["aider", "assister", ["nuire", "gêner", "abandonner"]],
      ["réfléchir", "méditer", ["agir sans penser", "courir", "dormir"]],
      ["important", "essentiel", ["secondaire", "inutile", "négligeable"]],
      ["ancien", "vieux", ["neuf", "récent", "moderne"]],
      ["heureux", "joyeux", ["triste", "malheureux", "morose"]],
      ["travail", "labeur", ["repos", "oisiveté", "pause"]],
      ["réussir", "triompher", ["échouer", "rater", "perdre"]],
      ["apprendre", "étudier", ["oublier", "ignorer", "négliger"]],
      ["calme", "tranquille", ["agité", "nerveux", "bruyant"]],
      ["grand", "immense", ["petit", "minuscule", "étroit"]],
      ["fatigué", "épuisé", ["reposé", "en forme", "vigoureux"]],
      ["silencieux", "muet", ["bruyant", "tapageur", "sonore"]],
      ["courageux", "brave", ["lâche", "peureux", "timoré"]],
      ["intelligent", "malin", ["bête", "sot", "naïf"]],
      ["problème", "difficulté", ["solution", "réponse", "aide"]],
      ["réponse", "solution", ["question", "problème", "échec"]]
    ];
    const [mot, correct, wrong] = choice(paires);
    return q("Français", "Vocabulaire", `Quel mot est le plus proche en sens de « ${mot} » ?`, correct, wrong, `Synonyme de « ${mot} » : ${correct}.`);
  }

  function makeFrenchPronom() {
    const items = [
      ["___ livres sont sur la table. (déterminant démonstratif pluriel)", "Ces", ["Ce", "Ces", "Ses", "C'est"], "« Ces » désigne plusieurs livres."],
      ["Il a perdu ___ clés. (possessif)", "ses", ["ces", "c'est", "s'est", "ce"], "« Ses » indique la possession."],
      ["___ est mon meilleur score. (présentatif)", "C'", ["S'", "Ce", "Se", "Ç'"], "« C'est » = cela est."],
      ["Ils ___ réunissent chaque soir. (pronom réfléchi)", "se", ["ce", "ces", "sa", "ceux"], "Pronom réfléchi avec un verbe pronominal."],
      ["___ allez-vous ce week-end ?", "Où", ["Ou", "Oû", "O", "Os"], "Lieu → « où » avec accent."],
      ["Tu choisis le thé ___ le café ?", "ou", ["où", "o", "ô", "os"], "Choix → « ou » sans accent."]
    ];
    const [prompt, correct, answers, explain] = choice(items);
    return q("Français", "Homophones", prompt, correct, answers.filter((a) => a !== correct), explain);
  }

  const frenchItems = buildFrenchItems();

  const physicsTemplates = [
    (d, t) => [`Un cycliste parcourt ${d} m en ${t} s. Sa vitesse moyenne est...`, `${d / t} m/s`, [`${d} m/s`, `${t / d} m/s`, `${d + t} m/s`, `${d * t} m/s`], `v = d/t = ${d}/${t} = ${d / t} m/s.`],
    (r, i) => [`Avec R = ${r} Ω et I = ${i} A, la tension U vaut...`, `${r * i} V`, [`${r + i} V`, `${r / i} V`, `${r * i + 5} V`, `${i / r} V`], `Loi d'Ohm : U = R × I = ${r} × ${i} = ${r * i} V.`],
    (m, h) => [`Un objet de masse ${m} kg est soulevé à ${h} m (g = 10 N/kg). Son énergie potentielle vaut...`, `${m * 10 * h} J`, [`${m + h} J`, `${m * h} J`, `${m * 10 + h} J`, `${m * h * 2} J`], `Ep = m × g × h = ${m} × 10 × ${h} = ${m * 10 * h} J.`],
    (u, i) => [`Si U = ${u} V et I = ${i} A, la puissance P = U × I vaut...`, `${u * i} W`, [`${u + i} W`, `${u / i} W`, `${u * i * 2} W`, `${u - i} W`], `P = ${u} × ${i} = ${u * i} W.`]
  ];

  const svtBase = [
    ["Où se font les échanges de O₂ et CO₂ entre l'air et le sang ?", "Dans les alvéoles pulmonaires", ["Dans la trachée", "Dans le cœur", "Dans l'estomac"], "Les poumons assurent les échanges gazeux via les alvéoles."],
    ["Quel support porte l'information génétique dans le noyau ?", "L'ADN", ["Le glucose", "L'hémoglobine", "Le dioxygène"], "La génétique (ADN, gènes, chromosomes) revient très souvent aux annales."],
    ["Un vaccin stimule surtout...", "le système immunitaire", ["la digestion", "la respiration", "la reproduction"], "Immunité et micro-organismes pathogènes : thème 2026 très probable."],
    ["Dans une chaîne alimentaire, le producteur primaire est...", "un végétal chlorophyllien", ["un prédateur", "un champignon décomposeur seul", "un herbivore"], "Les végétaux produisent la matière organique par photosynthèse."],
    ["L'effet de serre est lié surtout à l'accumulation de...", "gaz à effet de serre (CO₂, CH₄…)", ["azote pur", "oxygène seul", "eau liquide", "sel marin"], "Climat et activité humaine : thème récurrent 2021-2025."],
    ["Dans le tube digestif, l'absorption des nutriments se fait surtout...", "dans l'intestin grêle", ["dans la bouche", "dans l'œsophage", "dans la trachée"], "Digestion et nutrition : classique au brevet."],
    ["Un antibiotique agit principalement contre...", "certaines bactéries", ["les virus", "tous les microbes sans distinction", "les allergies"], "Se préserver des micro-organismes pathogènes : au programme 2026."],
    ["Deux individus avec le même génotype pour un caractère auront...", "le même allèle pour ce gène", ["forcément des yeux identiques", "des chromosomes différents", "un nombre de gènes différent"], "Génétique : génotype = ensemble des allèles d'un individu."],
    ["La photosynthèse produit surtout...", "de la matière organique et du dioxygène", ["du dioxyde de carbone uniquement", "de l'azote", "de la lumière"], "Les plantes captent l'énergie lumineuse pour fabriquer leur matière."],
    ["Le rôle des reins est surtout de...", "filtrer le sang et éliminer les déchets", ["pomper le sang", "digérer les aliments", "produire des hormones uniquement"], "Appareil excréteur : reins et urine."],
    ["Un écosystème comprend...", "des êtres vivants et leur milieu", ["uniquement des animaux", "uniquement des plantes", "seulement le climat"], "Écosystème = biotope + biocénose."],
    ["La biodiversité désigne...", "la diversité des espèces vivantes", ["un seul type d'animal", "la météo", "la pollution"], "Préserver la biodiversité est un enjeu majeur."],
    ["Un parasite est un organisme qui...", "vit aux dépens d'un hôte", ["aide toujours son hôte", "ne se nourrit pas", "fabrique sa nourriture"], "Relations entre espèces : parasitisme."],
    ["La fécondation chez les mammifères a lieu...", "dans la trompe de Fallope", ["dans l'utérus", "dans l'ovaire", "dans le vagin"], "Reproduction : fécondation puis implantation."],
    ["Le système nerveux transmet l'information via...", "des neurones et des influx nerveux", ["le sang uniquement", "les os", "la peau seule"], "Neurone = cellule qui transmet les messages nerveux."],
    ["Un écran solaire protège surtout contre...", "les UV du soleil", ["le vent", "la pluie", "le froid"], "Prévention : protection contre les rayonnements UV."],
    ["La digestion chimique commence surtout...", "dans la bouche avec la salive", ["dans le cœur", "dans les poumons", "dans les reins"], "Enzymes digestives : bouche, estomac, intestin."],
    ["Un prédateur est un animal qui...", "chasse et mange d'autres animaux", ["ne mange que des plantes", "décompose la matière morte", "ne se nourrit pas"], "Chaîne alimentaire : prédateur / proie."],
    ["La mitose permet...", "la multiplication des cellules", ["la formation de gamètes", "la digestion", "la respiration"], "Reproduction cellulaire : mitose vs méiose."],
    ["Un micro-organisme pathogène...", "peut provoquer une maladie", ["est toujours bénéfique", "n'existe pas", "ne se reproduit pas"], "Bactéries, virus, champignons pathogènes."]
  ];

  function mathsFactories() {
    return [
      () => {
        const [a, b, c] = choice(pythagoreanTriples);
        return q("Maths", "Pythagore", `Un triangle rectangle a pour côtés de l'angle droit ${a} cm et ${b} cm. Longueur de l'hypoténuse ?`, `${c} cm`, [`${a + b} cm`, `${c - 1} cm`, `${Math.abs(b - a)} cm`, `${c + 2} cm`], `c² = ${a}² + ${b}² = ${a * a + b * b}, donc c = ${c} cm.`);
      },
      () => {
        const [a, b, c] = choice(pythagoreanTriples);
        const known = choice([a, b]);
        const missing = known === a ? b : a;
        return q("Maths", "Pythagore", `Dans un triangle rectangle, l'hypoténuse mesure ${c} cm et un côté de l'angle droit mesure ${known} cm. L'autre côté mesure...`, `${missing} cm`, [`${c - known} cm`, `${known + 2} cm`, `${c + known} cm`, `${missing + 1} cm`], `${c}² − ${known}² = ${missing}², donc l'autre côté vaut ${missing} cm.`);
      },
      () => {
        if (Math.random() > 0.35) {
          const [a, b, c] = choice(pythagoreanTriples);
          const sides = shuffle([`${a} cm`, `${b} cm`, `${c} cm`]);
          return q("Maths", "Pythagore", `Un triangle a pour côtés ${sides[0]}, ${sides[1]} et ${sides[2]}. Est-il rectangle ?`, "Oui", ["Non", "On ne peut pas savoir", "Seulement s'il est isocèle"], `${a}² + ${b}² = ${c}² : la réciproque de Pythagore s'applique.`);
        }
        const a = rand(5, 12);
        const b = rand(6, 14);
        const c = a + b - rand(1, 4);
        const sides = shuffle([`${a} cm`, `${b} cm`, `${c} cm`]);
        return q("Maths", "Pythagore", `Un triangle a pour côtés ${sides[0]}, ${sides[1]} et ${sides[2]}. Est-il rectangle ?`, "Non", ["Oui", "On ne peut pas savoir", "Seulement s'il est isocèle"], `${a}² + ${b}² ≠ ${c}² : ce n'est pas un triangle rectangle.`);
      },
      () => {
        const k = choice([2, 2.5, 3, 4, 1.5]);
        const small = rand(2, 9);
        const large = Number((small * k).toFixed(1));
        return q("Maths", "Thalès", `Deux droites parallèles découpent des transversales. Sur l'une, un segment vaut ${small} cm ; sur l'autre, le segment correspondant vaut ${large} cm. Le rapport est...`, String(k), [String(k + 1), String(k / 2), String(small + large), String(large - small)], `Rapport = ${large}/${small} = ${k}.`);
      },
      () => {
        const k = choice([2, 3, 2.5, 4]);
        const ab = rand(2, 8);
        const bc = rand(2, 7);
        const abPrime = Number((ab * k).toFixed(1));
        const bcPrime = Number((bc * k).toFixed(1));
        return q("Maths", "Thalès", `(AB) // (A'B'). AB = ${ab} cm, A'B' = ${abPrime} cm et BC = ${bc} cm. Par Thalès, B'C' vaut...`, `${bcPrime} cm`, [`${bc + ab} cm`, `${bcPrime + 1} cm`, `${abPrime} cm`, `${bc / k} cm`], `Rapport ${k} : B'C' = ${bc} × ${k} = ${bcPrime} cm.`);
      },
      () => {
        const [a, b, c] = choice(pythagoreanTriples.slice(0, 6));
        const useCos = Math.random() > 0.5;
        const ratio = useCos ? `${b}/${c}` : `${a}/${c}`;
        const label = useCos ? "cosinus" : "sinus";
        const explain = useCos ? `cos = côté adjacent / hypoténuse = ${b}/${c}.` : `sin = côté opposé / hypoténuse = ${a}/${c}.`;
        return q("Maths", "Trigonométrie", `Triangle rectangle (${a}, ${b}, ${c}). Le ${label} de l'angle opposé au côté ${a} cm vaut...`, ratio, [`${a}/${c}`, `${b}/${a}`, `${c}/${b}`], explain);
      },
      () => {
        const n = rand(3, 25);
        return q("Maths", "Automatismes", `Quel est le résultat de ${n}² ?`, String(n * n), [String(n * 2), String(n * 10), String(n * n + n), String(n * n - 1)], `${n}² = ${n} × ${n} = ${n * n}.`);
      },
      () => {
        const base = choice([40, 50, 60, 80, 120, 150, 200, 240, 300, 360, 480]);
        const pct = choice([5, 10, 15, 20, 25, 30, 40, 50, 75]);
        const result = base * pct / 100;
        return q("Maths", "Pourcentages", `Combien vaut ${pct} % de ${base} ?`, String(result), [String(result + 5), String(result * 2), String(Math.max(1, result - 3)), String(base - result)], `${pct} % de ${base} = ${base} × ${pct} / 100 = ${result}.`);
      },
      () => {
        const den = choice([6, 8, 10, 12, 14, 16, 18, 20, 24, 30]);
        const num = rand(2, den - 2);
        const d = gcd(num, den);
        const answer = `${num / d}/${den / d}`;
        return q("Maths", "Fractions", `Simplifie la fraction ${num}/${den}.`, answer, [`${num}/${den / d}`, `${num / d}/${den}`, `${den / d}/${num / d}`, `${num + d}/${den}`], `On divise le numérateur et le dénominateur par ${d}.`);
      },
      () => {
        const a = rand(2, 8);
        const b = rand(-8, 12);
        const x = rand(2, 12);
        const value = a * x + b;
        const sign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        return q("Maths", "Fonctions", `Si f(x) = ${a}x ${sign}, combien vaut f(${x}) ?`, String(value), [String(value + a), String(value - b), String(a + x + b), String(value + 2)], `On remplace x par ${x} : ${a} × ${x} ${sign} = ${value}.`);
      },
      () => {
        const red = rand(2, 12);
        const blue = rand(2, 12);
        const total = red + blue;
        const answer = `${red}/${total}`;
        return q("Maths", "Probabilités", `Dans une urne, il y a ${red} boules rouges et ${blue} boules bleues. Probabilité de tirer une rouge ?`, answer, [`${blue}/${total}`, `${red}/${blue}`, `${total}/${red}`, `${red + 1}/${total}`], `Cas favorables : ${red}. Cas possibles : ${total}. Donc ${answer}.`);
      },
      () => {
        const vals = [rand(4, 15), rand(6, 18), rand(8, 22), rand(5, 20)];
        const count = choice([3, 4]);
        const slice = vals.slice(0, count);
        const mean = Math.round(slice.reduce((a, b) => a + b, 0) / count * 10) / 10;
        return q("Maths", "Statistiques", `Moyenne de ${slice.join(", ")} ?`, String(mean), [String(mean + 2), String(slice[0] + slice[1]), String(mean - 1), String(mean + 5)], `Moyenne = (${slice.join("+")})/${count} = ${mean}.`);
      },
      () => {
        const base = choice([2, 3, 5, 7]);
        const exp = choice([2, 3, 4, 5]);
        const result = base ** exp;
        return q("Maths", "Puissances", `Combien vaut ${base}^${exp} ?`, String(result), [String(result + base), String(base * exp), String(result - 1), String(base + exp)], `${base}^${exp} = ${result}.`);
      },
      () => {
        const a = rand(2, 9);
        const b = rand(2, 9);
        const c = rand(2, 6);
        const result = a + b * c;
        return q("Maths", "Automatismes", `Calcule sans calculatrice : ${a} + ${b} × ${c}`, String(result), [String(a + b + c), String(a * b + c), String((a + b) * c), String(result + 1)], `Priorité des opérations : ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${result}.`);
      },
      () => {
        const n = rand(11, 89);
        const complement = 100 - n;
        return q("Maths", "Automatismes", `Quel nombre faut-il ajouter à ${n} pour obtenir 100 ?`, String(complement), [String(complement + 5), String(complement - 3), String(n - complement), String(100 - complement + 10)], `${n} + ${complement} = 100.`);
      },
      () => {
        const den = choice([4, 5, 8, 10, 20]);
        const num = choice([1, 3, 7, 9, 15, 25, 35]);
        const decimal = num / den;
        const answer = Number.isInteger(decimal) ? String(decimal) : decimal.toFixed(1);
        return q("Maths", "Automatismes", `Quelle est l'écriture décimale de ${num}/${den} ?`, answer, [String(num / den + 0.5), String(num * den), String(den / num), String((num + 1) / den)], `${num} ÷ ${den} = ${answer}.`);
      }
    ];
  }

  function francaisFactories() {
    return [
      () => {
        const item = choice(frenchItems);
        return q("Français", item.topic, item.q, item.correct, item.answers.filter((a) => a !== item.correct), item.explain);
      },
      makeFrenchAccordQuestion,
      makeFrenchAvoirQuestion,
      makeFrenchConjugaison,
      makeFrenchReecriture,
      makeFrenchNatureMot,
      makeFrenchOrthographe,
      makeFrenchPronom,
      makeFrenchVerbTable,
      makeFrenchSynonyme
    ];
  }

  function histoireFactories() {
    return [
      () => {
        const item = choice(historyCurated);
        return q("Histoire-Géo", item.topic, item.prompt, item.correct, item.wrong, item.explain);
      },
      () => {
        const [date, meaning] = choice(historyFacts);
        const wrong = shuffle(historyFacts.filter((f) => f[0] !== date).map((f) => f[0])).slice(0, 3);
        return q("Histoire-Géo", "Repères", `Quelle date faut-il retenir pour : « ${meaning.replace(/\.$/, "")} » ?`, date, wrong, `${date} : ${meaning}`);
      },
      () => {
        const [date, meaning] = choice(historyFacts);
        const wrong = shuffle(historyFacts.filter((f) => f[1] !== meaning).map((f) => f[1])).slice(0, 3);
        return q("Histoire-Géo", "Repères", `À quoi correspond la date ${date} ?`, meaning, wrong, `${date} : ${meaning}`);
      },
      () => {
        const [term, def] = choice(geoFacts);
        const wrong = shuffle(geoFacts.filter((f) => f[0] !== term).map((f) => f[0])).slice(0, 3);
        return q("Histoire-Géo", "Géographie", `Quel terme de géographie correspond à : « ${def.replace(/\.$/, "")} » ?`, term, wrong, `${term} : ${def}`);
      },
      () => {
        const [term, def] = choice(geoFacts);
        const wrong = shuffle(geoFacts.filter((f) => f[1] !== def).map((f) => f[1])).slice(0, 3);
        return q("Histoire-Géo", "Géographie", `Que signifie le terme « ${term} » ?`, def, wrong, `${term} : ${def}`);
      }
    ];
  }

  function emcFactories() {
    const situations = [
      ["Un élève refuse de respecter la neutralité religieuse à l'école. Quelle valeur est en jeu ?", "laïcité", ["tolérance seule", "liberté d'expression sans limite", "discrimination"]],
      ["Un citoyen vote aux élections municipales. Il exerce son droit de...", "vote", ["abstention", "censure", "lobby"]],
      ["Une personne est traitée différemment à cause de son origine. C'est une...", "discrimination", ["intégration", "solidarité", "laïcité"]],
      ["Un journal vérifie ses sources avant de publier. C'est une bonne pratique des...", "médias", ["lobbys", "partis politiques", "ONG uniquement"]],
      ["Des bénévoles aident dans une association humanitaire. C'est de l'...", "engagement citoyen", ["abstention", "discrimination", "cyberharcèlement"]],
      ["La Constitution garantit les droits fondamentaux. Elle est le texte...", "suprême", ["secondaire", "local", "international seul"]],
      ["Refuser de voter sans raison valable s'appelle l'...", "abstention", ["suffrage", "censure", "franchise"]],
      ["Traiter autrui avec courtoisie relève de la valeur de...", "respect", ["discrimination", "harcèlement", "fake news"]]
    ];
    return [
      () => {
        const [term, def] = choice(emcFacts);
        const wrong = shuffle(emcFacts.filter((f) => f[0] !== term).map((f) => f[0])).slice(0, 3);
        return q("EMC", "Citoyenneté", `Quel mot d'EMC correspond à : « ${def.replace(/\.$/, "")} » ?`, term, wrong, `${term} : ${def}`);
      },
      () => {
        const [term, def] = choice(emcFacts);
        const wrong = shuffle(emcFacts.filter((f) => f[1] !== def).map((f) => f[1])).slice(0, 3);
        return q("EMC", "Citoyenneté", `Que signifie « ${term} » en EMC ?`, def, wrong, `${term} : ${def}`);
      },
      () => {
        const [prompt, correct, wrong] = choice(situations);
        return q("EMC", "Situations", prompt, correct, wrong, `${correct} : situation de citoyenneté au brevet.`);
      },
      () => {
        const [a, b] = shuffle(emcFacts).slice(0, 2);
        const correct = a[0];
        const wrong = shuffle(emcFacts.filter((f) => f[0] !== correct).map((f) => f[0])).slice(0, 3);
        return q("EMC", "Citoyenneté", `Lequel de ces termes désigne : « ${a[1]} » ?`, correct, wrong, `${a[0]} : ${a[1]}`);
      },
      () => {
        const institutions = [
          ["Assemblée nationale", "vote les lois", ["dirige l'armée seule", "juge les litiges", "nomme les maires directement"]],
          ["Président de la République", "chef de l'État", ["vote les lois", "siège au Sénat", "remplace les juges"]],
          ["Gouvernement", "dirige l'action de l'État", ["vote les lois", "élit le Président", "remplace la Constitution"]],
          ["Sénat", "chambre haute du Parlement", ["tribunal suprême", "ministère de l'Éducation", "organise les élections"]],
          ["Conseil constitutionnel", "vérifie la conformité des lois à la Constitution", ["vote le budget", "dirige la police", "remplace l'Assemblée"]]
        ];
        const [inst, correct, wrong] = choice(institutions);
        return q("EMC", "Institutions", `Quel est le rôle principal de : ${inst} ?`, correct, wrong, `${inst} : ${correct}.`);
      },
      () => {
        const valeurs = [
          ["Liberté", "pouvoir agir dans le respect de la loi", ["faire tout sans limite", "imposer sa religion", "refuser les règles"]],
          ["Égalité", "mêmes droits et devoirs pour tous", ["tout le monde pense pareil", "pas de différences culturelles", "même salaire pour tous métiers"]],
          ["Fraternité", "solidarité entre les citoyens", ["isolement volontaire", "compétition sans règles", "discrimination tolérée"]],
          ["Laïcité", "neutralité de l'État et liberté de conscience", ["interdire toute religion", "imposer une croyance", "exclure certains élèves"]]
        ];
        const [val, correct, wrong] = choice(valeurs);
        return q("EMC", "Valeurs", `Que signifie la valeur de ${val} ?`, correct, wrong, `${val} : ${correct}.`);
      },
      () => {
        const droits = [
          ["Droit de vote", "18 ans", ["16 ans", "21 ans", "15 ans"]],
          ["Élection présidentielle", "tous les 5 ans", ["tous les 3 ans", "tous les 7 ans", "tous les 10 ans"]],
          ["Majeur civile en France", "18 ans", ["16 ans", "21 ans", "15 ans"]],
          ["DDH", "1789", ["1958", "1905", "1945"]]
        ];
        const [sujet, correct, wrong] = choice(droits);
        return q("EMC", "Repères", `Concernant « ${sujet} », quelle réponse est correcte ?`, correct, wrong, `${sujet} : ${correct}.`);
      },
      () => {
        const ctxs = ["À l'école", "Dans la société", "En démocratie", "Pour un citoyen", "Dans les médias", "Au quotidien"];
        const [term, def] = choice(emcFacts);
        const ctx = choice(ctxs);
        const wrong = shuffle(emcFacts.filter((f) => f[0] !== term).map((f) => f[0])).slice(0, 3);
        return q("EMC", "Citoyenneté", `${ctx}, quel terme correspond à : « ${def} » ?`, term, wrong, `${term} : ${def}`);
      },
      () => {
        const paires = [
          ["droit", "de voter à 18 ans"],
          ["devoir", "de respecter les lois"],
          ["droit", "de liberté d'expression"],
          ["devoir", "de payer ses impôts"],
          ["droit", "d'être traité sans discrimination"],
          ["devoir", "de défendre la patrie si besoin"],
          ["droit", "de croire ou ne pas croire"],
          ["devoir", "de respecter autrui"]
        ];
        const [cat, detail] = choice(paires);
        const correct = cat;
        const wrong = ["privilège", "option", "interdiction"].filter((w) => w !== cat);
        return q("EMC", "Droits et devoirs", `« ${detail} » est plutôt un...`, correct, wrong, `${detail} : un ${cat} du citoyen.`);
      }
    ];
  }

  function sciencesFactories() {
    return [
      () => {
        const tpl = choice(physicsTemplates);
        const d = choice([60, 90, 100, 120, 150, 180, 200, 240, 300]);
        const t = choice([10, 12, 15, 20, 25, 30, 40, 50, 60]);
        const r = choice([4, 6, 8, 10, 12, 15, 20, 24]);
        const i = choice([0.2, 0.5, 1, 1.5, 2, 2.5, 3]);
        const m = choice([1, 2, 3, 4, 5, 6, 8, 10]);
        const h = choice([2, 3, 4, 5, 6, 8, 10]);
        const u = choice([6, 12, 24, 48, 120, 230]);
        const args = tpl === physicsTemplates[0] ? [d, t]
          : tpl === physicsTemplates[1] ? [r, i]
          : tpl === physicsTemplates[2] ? [m, h]
          : [u, i];
        const item = tpl(...args);
        return q("Sciences", "Physique", item[0], item[1], item[2], item[3]);
      },
      () => {
        const item = choice(svtBase);
        return q("Sciences", "SVT", item[0], item[1], item[2], item[3]);
      },
      () => {
        const bases = ["CO₂", "CH₄", "N₂O", "vapeur d'eau"];
        const gas = choice(bases);
        return q("Sciences", "SVT", `Lequel de ces gaz contribue à l'effet de serre ?`, gas, shuffle(bases.filter((g) => g !== gas)).concat(["O₂ pur"]).slice(0, 3), `${gas} est un gaz à effet de serre.`);
      },
      () => {
        const m = rand(1, 10);
        const v = rand(2, 20);
        const ec = 0.5 * m * v * v;
        return q("Sciences", "Physique", `Énergie cinétique : m = ${m} kg, v = ${v} m/s. Ec = ½mv² = ?`, `${ec} J`, [`${m * v} J`, `${ec + 10} J`, `${ec / 2} J`, `${m + v} J`], `Ec = ½ × ${m} × ${v}² = ${ec} J.`);
      },
      () => {
        const kmh = choice([18, 36, 54, 72, 90, 108]);
        const ms = kmh / 3.6;
        return q("Sciences", "Physique", `Convertir ${kmh} km/h en m/s donne...`, `${ms} m/s`, [`${kmh} m/s`, `${kmh / 10} m/s`, `${kmh * 3.6} m/s`, `${ms + 2} m/s`], `${kmh} km/h = ${kmh * 1000 / 3600} m/s = ${ms} m/s.`);
      },
      () => {
        const p = rand(100, 500);
        const t = rand(10, 60);
        const e = p * t;
        return q("Sciences", "Physique", `Un appareil de ${p} W fonctionne ${t} s. Énergie consommée E = P × t ?`, `${e} J`, [`${p + t} J`, `${e / 10} J`, `${p / t} J`, `${e * 2} J`], `E = ${p} × ${t} = ${e} J.`);
      },
      () => {
        const organes = [
          ["cœur", "pompe le sang", ["filtre le sang", "digère les aliments", "échange les gaz"]],
          ["poumons", "assurent les échanges gazeux", ["produisent les hormones", "absorbent les nutriments", "stockent l'urine"]],
          ["foie", "joue un rôle dans la digestion et la détoxification", ["pompe le sang", "produit des spermatozoïdes", "absorbe l'oxygène"]],
          ["reins", "filtrent le sang et produisent l'urine", ["digèrent les protéines", "produisent la bile", "stockent les ovules"]],
          ["estomac", "prépare la digestion des aliments", ["filtre l'air", "produit des anticorps seuls", "stocke les spermatozoïdes"]]
        ];
        const [organe, correct, wrong] = choice(organes);
        return q("Sciences", "SVT", `Quel est le rôle principal du/de la ${organe} ?`, correct, wrong, `${organe} : ${correct}.`);
      },
      () => {
        const n1 = rand(10, 40);
        const n2 = rand(2, 8);
        const n3 = rand(1, 5);
        const total = n1 + n2 + n3;
        return q("Sciences", "SVT", `Chaîne alimentaire : ${n1} producteurs, ${n2} herbivores, ${n3} carnivores. Combien de niveaux trophiques ?`, "3", ["1", "2", "4"], `Producteurs → herbivores → carnivores = 3 niveaux.`);
      }
    ];
  }

  const factoryMap = {
    maths: mathsFactories(),
    francais: francaisFactories(),
    histoire: histoireFactories(),
    emc: emcFactories(),
    sciences: sciencesFactories()
  };

  function buildStaticHistoryBank() {
    const bank = [];
    const seen = new Set();

    function add(question) {
      if (!seen.has(question.id)) {
        seen.add(question.id);
        bank.push({ ...question, bankSubject: "histoire" });
      }
    }

    historyCurated.forEach((item) => {
      add(q("Histoire-Géo", item.topic, item.prompt, item.correct, item.wrong, item.explain));
    });

    historyFacts.forEach((fact, index) => {
      const [date, meaning] = fact;
      const otherDates = historyFacts.filter((_, i) => i !== index).map((f) => f[0]);
      const otherMeanings = historyFacts.filter((_, i) => i !== index).map((f) => f[1]);

      [0, 1, 2].forEach((variant) => {
        add(q(
          "Histoire-Géo",
          "Repères",
          `Quelle date faut-il retenir pour : « ${meaning.replace(/\.$/, "")} » ?`,
          date,
          seededShuffle(otherDates, index * 7 + variant).slice(0, 3),
          `${date} : ${meaning}`
        ));
        add(q(
          "Histoire-Géo",
          "Repères",
          `À quoi correspond la date ${date} ?`,
          meaning,
          seededShuffle(otherMeanings, index * 11 + variant).slice(0, 3),
          `${date} : ${meaning}`
        ));
        add(q(
          "Histoire-Géo",
          "Repères",
          `Quel événement est associé à la date ${date} ?`,
          meaning,
          seededShuffle(otherMeanings, index * 13 + variant).slice(0, 3),
          `${date} : ${meaning}`
        ));
      });
    });

    geoFacts.forEach((fact, index) => {
      const [term, def] = fact;
      const otherTerms = geoFacts.filter((_, i) => i !== index).map((f) => f[0]);
      const otherDefs = geoFacts.filter((_, i) => i !== index).map((f) => f[1]);

      [0, 1].forEach((variant) => {
        add(q(
          "Histoire-Géo",
          "Géographie",
          `Quel terme de géographie correspond à : « ${def.replace(/\.$/, "")} » ?`,
          term,
          seededShuffle(otherTerms, index * 5 + variant).slice(0, 3),
          `${term} : ${def}`
        ));
        add(q(
          "Histoire-Géo",
          "Géographie",
          `Que signifie le terme « ${term} » ?`,
          def,
          seededShuffle(otherDefs, index * 9 + variant).slice(0, 3),
          `${term} : ${def}`
        ));
      });
    });

    return bank;
  }

  function generateBank(subject, target) {
    const makers = factoryMap[subject];
    const bank = [];
    const seen = new Set();
    let attempts = 0;
    const maxAttempts = target * (subject === "histoire" ? 200 : 80);

    if (subject === "histoire") {
      buildStaticHistoryBank().forEach((question) => {
        if (!seen.has(question.id)) {
          seen.add(question.id);
          bank.push(assignDifficulty({ ...question, bankSubject: subject }));
        }
      });
    }

    while (bank.length < target && attempts < maxAttempts) {
      attempts += 1;
      const question = choice(makers)();
      if (!seen.has(question.id)) {
        seen.add(question.id);
        bank.push(assignDifficulty({ ...question, bankSubject: subject }));
      }
    }
    return bank;
  }

  const banks = {};
  SUBJECTS.forEach((subject) => {
    banks[subject] = generateBank(subject, BANK_SIZE).filter(isQualityQuestion);
  });

  function expandSubjectBank(subject, target) {
    if (banks[subject].length >= target) return;
    const extra = generateBank(subject, target * 2).filter((q) => isQualityQuestion(q) && !banks[subject].some((b) => b.id === q.id));
    banks[subject] = [...banks[subject], ...extra].slice(0, target);
  }
  SUBJECTS.forEach((s) => expandSubjectBank(s, BANK_SIZE));
  SUBJECTS.forEach((s) => {
    banks[s] = banks[s].map(assignDifficulty);
  });

  function dateSeed(extra) {
    const now = new Date();
    const base = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    return base + (extra || 0);
  }

  function pickFromPool(pool, count, exclude, seed, options) {
    const minD = options?.minDifficulty || 1;
    let available = pool.filter(
      (q) => isQualityQuestion(q) && !exclude.has(q.id) && (q.difficulty || 2) >= minD
    );
    if (available.length < count) {
      available = pool.filter((q) => isQualityQuestion(q) && !exclude.has(q.id));
    }
    if (available.length < count) {
      const qualityPool = pool.filter(isQualityQuestion);
      const seenIds = new Set(available.map((q) => q.id));
      const filler = seededShuffle(qualityPool.filter((q) => !seenIds.has(q.id)), seed + 99);
      available = [...available, ...filler];
    }
    if (available.length < count) {
      available = pool.filter(isQualityQuestion);
    }
    if (options?.diverse !== false) {
      return pickDiverseFromPool(available, count, seed, options);
    }
    return seededSample(available, count, seed);
  }

  function pickStratified(subjectIds, count, exclude, seed, options) {
    const ids = subjectIds?.length ? subjectIds : SUBJECTS;
    const picked = [];
    const perSubject = Math.floor(count / ids.length);
    let remainder = count % ids.length;

    ids.forEach((id, index) => {
      let n = perSubject + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder -= 1;
      if (id === "sciences") {
        const svtPool = banks.sciences.filter((q) => q.topic === "SVT");
        const physPool = banks.sciences.filter((q) => q.topic === "Physique");
        const half = Math.ceil(n / 2);
        picked.push(...pickFromPool(svtPool, half, exclude, seed + index * 17, options));
        picked.push(...pickFromPool(physPool, n - half, exclude, seed + index * 17 + 7, options));
        return;
      }
      const pool = banks[id] || [];
      picked.push(...pickFromPool(pool, n, exclude, seed + index * 31, options));
    });

    const unique = [];
    const used = new Set();
    picked.forEach((q) => {
      if (!used.has(q.id)) {
        used.add(q.id);
        unique.push(q);
      }
    });

    if (unique.length < count) {
      const allPool = [];
      ids.forEach((id) => { if (banks[id]) allPool.push(...banks[id]); });
      const extra = pickFromPool(allPool, count - unique.length, new Set([...exclude, ...used]), seed + 500, options);
      extra.forEach((q) => {
        if (!used.has(q.id)) {
          used.add(q.id);
          unique.push(q);
        }
      });
    }

    const sliced = seededShuffle(unique, seed + 1000).slice(0, count);
    return options?.diverse !== false ? diversifyQueue(sliced, seed + 2000) : sliced;
  }

  function pickQuestions(subjectIds, count, excludeIds, options) {
    const exclude = excludeIds instanceof Set ? excludeIds : new Set(excludeIds || []);
    const seed = options?.seed ?? Math.floor(Math.random() * 999999);
    if (options?.stratify !== false && (subjectIds?.length || 0) !== 1) {
      return pickStratified(subjectIds?.length ? subjectIds : SUBJECTS, count, exclude, seed, options);
    }
    const ids = subjectIds?.length ? subjectIds : SUBJECTS;
    const pool = [];
    ids.forEach((id) => {
      if (id === "mix") SUBJECTS.forEach((s) => pool.push(...banks[s]));
      else if (banks[id]) pool.push(...banks[id]);
    });
    const picked = pickFromPool(pool, count, exclude, seed, options);
    return options?.diverse !== false ? diversifyQueue(picked, seed + 3000) : picked;
  }

  function pickDailyQuestions(subjectIds, count, excludeIds, options) {
    return pickStratified(
      subjectIds,
      count,
      excludeIds instanceof Set ? excludeIds : new Set(excludeIds || []),
      dateSeed(42),
      options
    );
  }

  function countBySubject() {
    const counts = {};
    SUBJECTS.forEach((s) => { counts[s] = banks[s].length; });
    return counts;
  }

  window.QuestionBank = {
    BANK_SIZE,
    banks,
    pickQuestions,
    pickDailyQuestions,
    countBySubject,
    subjects: SUBJECTS,
    isQualityQuestion
  };
})();
