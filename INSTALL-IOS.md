# Installer l'app Brevet 2026 sur iPhone (.ipa)

Guide pour installer **l'application iPhone**, pas le site web.

---

## Ce qu'il te faut

- Un **iPhone** (iOS 15+)
- Un **PC Windows** avec câble USB
- Ton **Apple ID** (gratuit, pas besoin du compte développeur à 99 €)
- **Sideloadly** : https://sideloadly.io

---

## Étape 1 — Télécharger le .ipa

1. Va sur GitHub : **https://github.com/asiop366/brevet-site-yahya/actions**
2. Clique sur le workflow **iOS Build** le plus récent (coche verte).
3. Tout en bas, section **Artifacts**, télécharge **`brevet2026-ios-ipa`**.
4. **Dézippe** le fichier `.zip` de GitHub → tu obtiens **`Brevet2026.ipa`**.

> Le `.ipa` ne s'ouvre pas en double-cliquant sur Windows. C'est normal.

Pas de build récent ? Lance-en un : **Actions → iOS Build → Run workflow → Run workflow**.

---

## Étape 2 — Installer avec Sideloadly

1. Installe **iTunes** (Microsoft Store ou apple.com) si Sideloadly le demande.
2. Branche ton iPhone en USB, déverrouille-le, fais **Confiance** à l'ordinateur.
3. Ouvre **Sideloadly**.
4. Glisse **`Brevet2026.ipa`** dans la fenêtre.
5. Entre ton **Apple ID** → clique **Start**.
6. Sur l'iPhone : **Réglages → Général → VPN et gestion de l'appareil** → fais confiance au profil si demandé.

L'app **Brevet 2026** apparaît sur ton écran d'accueil.

---

## Renouvellement (tous les 7 jours)

Avec un Apple ID gratuit, l'app **expire après 7 jours**.

Refais la même opération dans **Sideloadly** (brancher → Start). Tes scores restent sauvegardés tant que tu ne supprimes pas l'app.

---

## Alternative — AltStore (sur l'iPhone)

1. Installe **AltServer** sur PC : https://altstore.io
2. Installe **AltStore** sur l'iPhone via AltServer (USB).
3. Envoie **`Brevet2026.ipa`** sur l'iPhone (AirDrop, iCloud, Fichiers).
4. AltStore → **My Apps** → **+** → choisis le `.ipa`.

Rafraîchis chaque semaine dans AltStore (Wi‑Fi + AltServer sur PC).

---

## Dépannage

| Problème | Solution |
|----------|----------|
| « Not in the correct format » | Dézippe l'artifact GitHub. Utilise **Sideloadly**, pas un double-clic sur PC |
| L'app disparaît après 7 jours | Normal avec Apple ID gratuit → réinstalle via Sideloadly |
| Score perdu | Ne supprime pas l'app ; les données sont sur le téléphone |
| UI pas à jour | Télécharge le **dernier** build Actions (version 1.1+) |

---

## Versions

| Version | Contenu |
|---------|---------|
| **1.3** | Thèmes colorés + onglet Paramètres · défaut sombre |
| **1.2** | Nouvelle UI « carnet » claire, dock flottant, quiz 2×2 |

Build automatique à chaque push sur `main` → artifact **`brevet2026-ios-ipa`**.
