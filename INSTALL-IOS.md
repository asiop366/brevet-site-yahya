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
3. Télécharge l'artifact **brevet2026-ios-ipa** (fichier `App.ipa`).

Ou lance le workflow manuellement : **Actions** → **iOS Build** → **Run workflow**.

### Étape B — Installer AltStore (Windows + iPhone)

1. Installe **iTunes** et **iCloud** pour Windows (Apple).
2. Télécharge **AltServer** : https://altstore.io
3. Branche ton iPhone en USB, fais confiance à l'ordinateur.
4. Lance AltServer (icône dans la barre des tâches) → **Install AltStore** → choisis ton iPhone.
5. Sur l'iPhone : **Réglages → Général → VPN et gestion de l'appareil** → fais confiance au profil AltStore.

### Étape C — Installer l'app

1. Ouvre **AltStore** sur l'iPhone.
2. Onglet **My Apps** → **+** (en haut à gauche).
3. Sélectionne le fichier `App.ipa` (AirDrop depuis le PC, ou via Fichiers iCloud).
4. AltStore signe l'app avec ton Apple ID.

**Chaque semaine** : ouvre AltStore sur le même Wi‑Fi qu'AltServer sur le PC pour rafraîchir l'app.

Alternative : **SideStore** (https://sidestore.io) — même principe, sans PC allumé en permanence.

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
| .ipa refuse de s'installer | Vérifie que l'IPA est bien signé par AltStore |
| App expirée après 7 jours | Rafraîchis dans AltStore (Wi‑Fi + AltServer) |
| Score perdu | Données dans localStorage — ne pas supprimer l'app |
