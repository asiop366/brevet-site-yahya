# Installer Brevet 2026 sur iPhone

Deux méthodes : **PWA** (recommandée, gratuite, sans limite) ou **fichier .ipa** via AltStore (renouvellement hebdomadaire).

---

## Méthode 1 — PWA (la plus simple)

Aucun compte développeur Apple requis.

1. Ouvre **Safari** sur ton iPhone (pas Chrome).
2. Va sur : **https://brevet-site-yahya.vercel.app**
3. Appuie sur le bouton **Partager** (carré avec flèche).
4. Choisis **Sur l'écran d'accueil**.
5. Confirme le nom **Brevet 2026** → **Ajouter**.

L'app s'ouvre en plein écran, comme une vraie application, avec ton score sauvegardé localement.

**Hors-ligne** : après la première visite, le quiz fonctionne sans connexion (service worker).

---

## Méthode 2 — Fichier .ipa (AltStore / SideStore)

Pour un vrai fichier `.ipa` installable sans App Store.

### Limites avec un Apple ID gratuit

- L'app **expire après 7 jours** → il faut la réinstaller ou la « rafraîchir » dans AltStore.
- Maximum **3 apps** sideloadées en même temps.
- Pas de compte Apple Developer (99 €/an) nécessaire.

### Étape A — Télécharger le .ipa

1. Va sur le repo GitHub : `asiop366/brevet-site-yahya`
2. Onglet **Actions** → workflow **iOS Build** → dernier run réussi.
3. Télécharge l'artifact **brevet2026-ios-ipa** (c'est un `.zip` GitHub).
4. **Dézippe** ce fichier sur ton PC → tu dois obtenir **`Brevet2026.ipa`** (pas le `.zip` GitHub lui-même).

Ou lance le workflow manuellement : **Actions** → **iOS Build** → **Run workflow**.

> **Important** : un `.ipa` ne s'ouvre pas sur Windows comme un .exe. L'erreur « not in the correct format » apparaît si tu double-cliques dessus sur PC, ou si tu essaies de l'installer depuis l'app **Fichiers** sans outil de sideload.

### Étape B — Installer AltStore (Windows + iPhone)

1. Installe **iTunes** et **iCloud** pour Windows (Apple).
2. Télécharge **AltServer** : https://altstore.io
3. Branche ton iPhone en USB, fais confiance à l'ordinateur.
4. Lance AltServer (icône dans la barre des tâches) → **Install AltStore** → choisis ton iPhone.
5. Sur l'iPhone : **Réglages → Général → VPN et gestion de l'appareil** → fais confiance au profil AltStore.

### Étape C — Installer l'app

**Option 1 — Sideloadly (souvent le plus simple sur Windows)**

1. Télécharge **Sideloadly** : https://sideloadly.io
2. Branche l'iPhone en USB, déverrouille-le, fais confiance au PC.
3. Glisse **`Brevet2026.ipa`** dans Sideloadly.
4. Entre ton **Apple ID** → **Start**.
5. Sideloadly signe et installe l'app directement sur l'iPhone.

**Option 2 — AltStore (sur l'iPhone)**

1. Ouvre **AltStore** sur l'iPhone.
2. Onglet **My Apps** → **+** (en haut à gauche).
3. Choisis **`Brevet2026.ipa`** (envoie-le via AirDrop, iCloud ou Fichiers).
4. AltStore signe l'app avec ton Apple ID.

**Chaque semaine** : rafraîchis l'app dans Sideloadly ou AltStore (Wi‑Fi + AltServer pour AltStore).

Alternative : **SideStore** (https://sidestore.io) — même principe qu'AltStore.

---

## Structure du projet

| Dossier / fichier | Rôle |
|-------------------|------|
| `www/` | Application web (PWA) |
| `www/index.html` | Interface mobile à onglets |
| `www/app.js` | Moteur de questions |
| `ios/` | Projet Xcode Capacitor |
| `capacitor.config.json` | Config native iOS |

### Commandes utiles (développement)

```bash
npm install
npm run build:web      # génère les icônes + prépare www/
npx cap sync ios       # copie www/ vers le projet iOS
npx cap open ios       # ouvre Xcode (Mac uniquement)
```

---

## Dépannage

| Problème | Solution |
|----------|----------|
| PWA ne s'installe pas | Utilise Safari, pas Chrome |
| « Not in the correct format » | Ne double-clique pas le .ipa sur PC. Dézippe l'artifact GitHub, utilise **Sideloadly** ou **AltStore**, pas l'app Fichiers seule |
| .ipa refuse de s'installer | Télécharge le **dernier** build Actions (après correction du packaging) |
| App expirée après 7 jours | Rafraîchis dans Sideloadly / AltStore |
| Score perdu | Données dans localStorage — ne pas supprimer l'app |
