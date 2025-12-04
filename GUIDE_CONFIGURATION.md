# 🔧 Guide de Configuration - Medical Secure App

Ce guide vous aide à configurer votre environnement local.

---

## 📋 Étape 1 : Copier le fichier .env

Après avoir cloné le projet, créez votre fichier de configuration :
```bash
cp .env.example .env
```

**Sur Windows :**
```bash
copy .env.example .env
```

---

## 🔑 Étape 2 : Générer la clé d'application

Cette commande crée automatiquement une clé sécurisée dans votre `.env` :
```bash
php artisan key:generate
```

✅ Votre `.env` aura maintenant une ligne comme :
```env
APP_KEY=base64:xxxxxxxxxxxxxxxxxxx
```

---

## 🗄️ Étape 3 : Configurer la base de données

### A. Créer la base de données

1. Ouvrir **phpMyAdmin** : http://localhost/phpmyadmin
2. Cliquer sur **"Nouvelle base de données"**
3. Nom : `medical_app`
4. Interclassement : `utf8mb4_unicode_ci`
5. Cliquer sur **"Créer"**

### B. Vérifier les identifiants dans .env

Ouvrir le fichier `.env` et vérifier ces lignes :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medical_app
DB_USERNAME=root
DB_PASSWORD=              # Laisser vide si pas de mot de passe MySQL
```

💡 **Si vous avez un mot de passe MySQL**, mettez-le sur la ligne `DB_PASSWORD`.

---

## 📧 Étape 4 : Configurer les emails (OPTIONNEL)

Vous avez **3 options** selon vos besoins :

---

### ✅ Option 1 : Ne pas envoyer d'emails (recommandé pour débuter)

Dans `.env`, modifier :
```env
MAIL_MAILER=log
```

Les emails seront enregistrés dans `storage/logs/laravel.log` au lieu d'être envoyés.

**Avantage :** Aucune configuration nécessaire, fonctionne immédiatement.

---

### ✅ Option 2 : Mailtrap - Emails de test (recommandé pour développement)

**Mailtrap** capture les emails sans les envoyer vraiment. Parfait pour tester !

#### Étapes :

1. Créer un compte **GRATUIT** sur https://mailtrap.io
2. Aller dans **Email Testing → Inbox**
3. Copier les identifiants SMTP affichés
4. Modifier dans `.env` :
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre-username-mailtrap        # ← Copier depuis Mailtrap
MAIL_PASSWORD=votre-password-mailtrap        # ← Copier depuis Mailtrap
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@medical-app.com"
MAIL_FROM_NAME="Medical Secure App"
```

✅ Les emails apparaîtront dans votre boîte Mailtrap, pas dans de vrais emails !

---

### ✅ Option 3 : Gmail - Vrais emails (pour production)

Pour envoyer de vrais emails via votre compte Gmail :

#### Étapes :

1. **Activer la validation en 2 étapes sur Gmail** :
   - Aller sur https://myaccount.google.com/security
   - Chercher "Validation en deux étapes"
   - Activer

2. **Créer un mot de passe d'application** :
   - Aller sur https://myaccount.google.com/apppasswords
   - Cliquer sur "Créer"
   - Nom : `Medical App`
   - Copier le mot de passe à 16 caractères (exemple : `abcd efgh ijkl mnop`)
   - **⚠️ Enlevez les espaces !** → `abcdefghijklmnop`

3. **Modifier dans .env** :
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com          # ← Votre email Gmail
MAIL_PASSWORD=abcdefghijklmnop               # ← Le mot de passe à 16 caractères (SANS espaces)
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="votre-email@gmail.com"
MAIL_FROM_NAME="Medical Secure App"
```

---

## 🚀 Étape 5 : Installer et lancer l'application

### A. Installer les dépendances
```bash
composer install
npm install
```

### B. Créer les tables de la base de données
```bash
php artisan migrate
php artisan db:seed
php artisan storage:link
```

### C. Vider les caches
```bash
php artisan config:clear
php artisan cache:clear
```

### D. Lancer l'application

**Terminal 1 - Serveur Laravel :**
```bash
php artisan serve
```

**Terminal 2 - Vite (React) :**
```bash
npm run dev
```

---

## 🎯 Accéder à l'application

- **URL** : http://localhost:8000
- **Compte Admin** :
  - Email : `admin@medical-app.com`
  - Mot de passe : `Admin@2025!`

---

## ❓ Problèmes courants

### Erreur "Class not found"
```bash
composer dump-autoload
```

### Erreur "npm not found"
Installer Node.js : https://nodejs.org

### Erreur "Access denied for user 'root'"
Vérifier `DB_USERNAME` et `DB_PASSWORD` dans `.env`

### Erreur "SQLSTATE[HY000] [1049]"
La base de données `medical_app` n'existe pas. Créez-la dans phpMyAdmin.

### Email ne s'envoie pas
- Vérifier que `php artisan config:clear` a été exécuté
- Vérifier les identifiants dans `.env`
- Regarder les logs : `storage/logs/laravel.log`

---

