# RH Connect - Application de Gestion RH

Application fullstack de gestion des ressources humaines avec React et Express.

## 🚀 Technologies

### Frontend
- **React 19** avec **Vite**
- **TypeScript**
- **Material-UI (MUI)**
- **React Router DOM**
- **Axios** pour les appels API
- **React Toastify** pour les notifications
- **Material React Table** pour les tableaux
- **jsPDF** pour la génération de PDF

### Backend
- **Express** avec **TypeScript**
- **TypeORM** pour l'ORM
- **MySQL** comme base de données
- **TSOA** pour la documentation API
- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe

## 📦 Installation

```bash
# Cloner le repository
git clone [url-du-repo]
cd rh-connect-project

# Installer toutes les dépendances
npm run install:all

# Ou installer séparément
npm run install:frontend
npm run install:backend
```

## 🛠️ Développement

```bash
# Lancer frontend et backend en parallèle
npm run dev

# Ou lancer séparément
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3000
```

## 🏗️ Build & Production

```bash
# Build des deux applications
npm run build

# Lancer en production
npm start
```

## 🗄️ Base de données

```bash
# Générer une migration
npm run migration:generate -- src/migrations/NomDeLaMigration

# Exécuter les migrations
npm run migration:run

# Créer une migration vide
npm run migration:create -- src/migrations/NomDeLaMigration
```

## 📁 Structure du projet

```
rh-connect-project/
├── frontend/           # Application React Vite
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/            # API Express TypeScript
│   ├── src/
│   ├── build/
│   └── package.json
├── package.json        # Scripts racine
└── README.md
```

## 🌿 Branches Git

- `main` - Version stable de production
- `develop` - Branche de développement principal
- `frontend/*` - Fonctionnalités frontend
- `backend/*` - Fonctionnalités backend
- `feature/*` - Nouvelles fonctionnalités fullstack

## 📝 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance frontend + backend en mode développement |
| `npm run build` | Build des deux applications |
| `npm run start` | Lance les applications en production |
| `npm run lint` | Vérification du code frontend |
| `npm run migration:run` | Exécute les migrations de base de données |

## 🔧 Configuration

1. Créer un fichier `.env` dans le dossier `backend/`
2. Configurer les variables d'environnement (base de données, JWT secret, etc.)
3. Exécuter les migrations avec `npm run migration:run`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'feat: ajouter nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request


## .env exemple
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=rh_connect

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Server
PORT=8000
NODE_ENV=development

#Pointeuse
API_URL=http://10.4.101.206
API_USERNAME=admin
API_PASSWORD=

