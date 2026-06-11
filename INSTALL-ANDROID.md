# Installer l'app Brevet 2026 sur Android (.apk)

Guide pour installer **l'application Android**, pas le site web.

---

## Ce qu'il te faut

- Un **téléphone Android** (Android 7+)
- Le fichier **`Brevet2026.apk`**
- Autoriser **« Sources inconnues »** ou **« Installer des apps inconnues »** pour ton navigateur / gestionnaire de fichiers

---

## Étape 1 — Télécharger le .apk

1. Va sur GitHub : **https://github.com/asiop366/brevet-site-yahya/actions**
2. Clique sur le workflow **Android Build** le plus récent (coche verte).
3. Tout en bas, section **Artifacts**, télécharge **`brevet2026-android-apk`**.
4. **Dézippe** le `.zip` de GitHub → tu obtiens **`Brevet2026.apk`**.

Pas de build récent ? Lance-en un : **Actions → Android Build → Run workflow → Run workflow**.

---

## Étape 2 — Installer sur le téléphone

### Option A — Transfert USB (PC → téléphone)

1. Branche le téléphone en USB.
2. Copie **`Brevet2026.apk`** dans le dossier **Téléchargements** du téléphone.
3. Sur le téléphone, ouvre **Fichiers** → **Téléchargements** → **`Brevet2026.apk`**.
4. Appuie sur **Installer**.

### Option B — Depuis le téléphone directement

1. Envoie-toi le `.apk` (WhatsApp, Drive, e-mail, etc.).
2. Ouvre le fichier reçu → **Installer**.

---

## Mises à jour

Contrairement à l'iPhone avec Sideloadly, **l'APK Android ne expire pas** après 7 jours.

Pour mettre à jour : télécharge le **dernier** build Actions, installe par-dessus (ou supprime l'ancienne app puis réinstalle). Tes scores restent sauvegardés tant que tu ne **désinstalles** pas l'app.

---

## Dépannage

| Problème | Solution |
|----------|----------|
| « Application bloquée » | Réglages → Sécurité → autoriser l'installation depuis cette source |
| « Package corrompu » | Re-télécharge l'artifact GitHub et dézippe bien le `.apk` |
| UI pas à jour | Installe le **dernier** build Actions (version 1.3+) |
| Score perdu | Ne désinstalle pas l'app ; les données sont sur le téléphone |

---

## Versions

| Version | Contenu |
|---------|---------|
| **1.3** | Thèmes colorés + Paramètres · QCM 40 Q/matière · Maths Thalès/Pythagore · Histoire dates |
| **1.2** | UI « carnet », Session Ultime, fiches interactives |

Build automatique à chaque push sur `main` → artifact **`brevet2026-android-apk`**.
