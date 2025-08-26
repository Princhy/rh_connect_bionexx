# 🏢 Système de Pointage avec Webhook Hikvision

Système de gestion des pointages avec intégration webhook pour les pointeuses Hikvision DS-K1T342EFWX-E1.

## 🚀 Fonctionnalités

- ✅ **Webhook Hikvision** : Réception automatique des pointages d'empreinte digitale
- ✅ **Filtrage intelligent** : Seuls les événements d'empreinte digitale (subEventType = 38) sont traités
- ✅ **Mode silencieux** : Configuration pour réduire les logs en production
- ✅ **Notifications** : Email, WebSocket, et notifications push
- ✅ **API REST** : Interface complète pour la gestion des pointages
- ✅ **Base de données** : Stockage sécurisé avec TypeORM

## ⚙️ Configuration

### Variables d'environnement

Copiez `env.example` vers `.env` et configurez :

```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=pointage_db

# JWT
JWT_SECRET=votre-secret-jwt-super-securise

# API Hikvision
API_USERNAME=admin
API_PASSWORD=12345

# Notifications
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_WEBSOCKET_NOTIFICATIONS=true
ENABLE_PUSH_NOTIFICATIONS=false

# Debug et Performance
ENABLE_WEBHOOK_DEBUG=false  # true pour debug
ENABLE_WEBHOOK_SILENT=true  # Mode silencieux complet

# Email (si activé)
ADMIN_EMAIL=admin@votreentreprise.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app

# Serveur
PORT=8000
NODE_ENV=development
```

## 🔧 Installation

```bash
# Installer les dépendances
npm install

# Configurer la base de données
# Créer la base de données et exécuter les migrations

# Démarrer le serveur
npm run dev
```

## 📡 Webhook Hikvision

### Configuration de la pointeuse

Dans l'interface web de la pointeuse Hikvision :
- **IP domaine** : `10.4.101.90`
- **Port** : `8000`
- **URL** : `/pointages/webhook-notification`

### Endpoint

```
POST /pointages/webhook-notification
```

Le système traite automatiquement :
- ✅ Événements d'empreinte digitale (subEventType = 38)
- ❌ Ignore les événements système et tests
- 🔄 Protection contre les doublons
- ⏱️ Rate limiting pour éviter le spam

## 🎯 Modes de fonctionnement

### Mode Production (Silencieux)
```env
ENABLE_WEBHOOK_DEBUG=false
ENABLE_WEBHOOK_SILENT=true
```

### Mode Debug
```env
ENABLE_WEBHOOK_DEBUG=true
ENABLE_WEBHOOK_SILENT=false
```

## 📊 API Endpoints

- `GET /pointages` - Liste des pointages
- `POST /pointages` - Créer un pointage
- `GET /pointages/:id` - Détails d'un pointage
- `PUT /pointages/:id` - Modifier un pointage
- `DELETE /pointages/:id` - Supprimer un pointage

## 🔔 Notifications

Le système envoie automatiquement des notifications pour chaque pointage :
- 📧 **Email** : Notification aux administrateurs
- 🔌 **WebSocket** : Notification en temps réel
- 📱 **Push** : Notifications mobiles (si configuré)

## 🏗️ Architecture

```
src/
├── pointage/
│   ├── pointage.controller.ts    # API REST
│   ├── pointage.service.ts       # Logique métier
│   ├── pointage.entity.ts        # Modèle de données
│   ├── webhook.controller.ts     # Gestion webhook
│   ├── hikvision-webhook.service.ts  # Traitement Hikvision
│   └── notification.service.ts   # Notifications
├── middleware/
│   └── rate-limiter.middleware.ts # Protection anti-spam
└── app.ts                        # Configuration Express
```

## 🚨 Dépannage

### Problèmes courants

1. **Webhook non reçu** : Vérifier la configuration IP/Port de la pointeuse
2. **Logs trop verbeux** : Activer `ENABLE_WEBHOOK_SILENT=true`
3. **Pointages dupliqués** : Le système détecte automatiquement les doublons
4. **Notifications non envoyées** : Vérifier la configuration SMTP/WebSocket

### Logs utiles

- `✅ Événement d'empreinte digitale détecté` : Pointage valide reçu
- `⏩ Pointage déjà existant` : Doublon détecté et ignoré
- `🔄 Événement ignoré` : Événement système filtré

## 📝 Licence

Projet interne - Bionexx
