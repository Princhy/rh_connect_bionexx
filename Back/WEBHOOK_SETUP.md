# 🔔 Configuration Webhook Hikvision

## Configuration de la pointeuse

Dans l'interface web de la pointeuse Hikvision DS-K1T342EFWX-E1 :

### Paramètres HTTP
- **IP domaine** : `10.4.101.90`
- **Port** : `8000`
- **URL** : `/pointages/webhook-notification`

### Configuration recommandée
- **Méthode** : POST
- **Format** : multipart/form-data
- **Fréquence** : En temps réel

## Variables d'environnement

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

## Fonctionnement

### Filtrage automatique
- ✅ **Accepté** : Événements d'empreinte digitale (subEventType = 38)
- ❌ **Ignoré** : Événements système, tests, et autres types

### Protection
- 🔄 **Détection de doublons** : Évite les pointages en double
- ⏱️ **Rate limiting** : 3 requêtes max par 2 secondes
- 🛡️ **Validation** : Vérification des données obligatoires

### Notifications
- 📧 **Email** : Envoi automatique aux administrateurs
- 🔌 **WebSocket** : Notification en temps réel
- 📱 **Push** : Notifications mobiles (optionnel)

## Gestion des Doublons

### Problème résolu
Les pointeuses peuvent envoyer plusieurs fois le même événement, créant des doublons dans la base de données.

### Solution implémentée
- **SerialNo unique** : Génération d'un identifiant unique basé sur :
  - Timestamp de l'événement (millisecondes)
  - Hash du matricule de l'employé
- **Formule** : `serialNo = timestamp + hash(matricule)`
- **Avantages** :
  - Même employé, même minute = serialNo différent (car timestamp différent)
  - Employés différents, même minute = serialNo différent (car hash différent)
  - Doublons exacts = même serialNo (détectés automatiquement)

### Comportement
- ✅ **Pointage unique** : Créé normalement
- ⏩ **Doublon détecté** : Ignoré avec message de confirmation
- 🔍 **Logs détaillés** : Traçabilité complète des doublons

## Dépannage

### Problèmes courants
1. **Webhook non reçu** → Vérifier IP/Port de la pointeuse
2. **Logs trop verbeux** → Activer `ENABLE_WEBHOOK_SILENT=true`
3. **Pointages manqués** → Vérifier que subEventType = 38
4. **Erreurs de connexion** → Vérifier la configuration réseau
5. **Doublons persistants** → Vérifier la configuration de la pointeuse

### Logs utiles
- `✅ Événement d'empreinte digitale détecté` : Pointage valide
- `⏩ Pointage doublon détecté` : Doublon ignoré
- `🔄 Événement ignoré` : Événement système filtré
