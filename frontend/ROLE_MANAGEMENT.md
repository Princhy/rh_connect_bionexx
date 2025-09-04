# Gestion des Rôles - RH CONNECT

## Vue d'ensemble

L'application RH CONNECT utilise un système de rôles pour contrôler l'accès aux différentes fonctionnalités. Quatre rôles principaux sont définis :

### 1. **Admin** 🔴
- **Accès complet** à toutes les fonctionnalités
- **Permissions** :
  - Gestion complète des employés (création, modification, suppression)
  - Gestion des références (lieux, départements, etc.)
  - Gestion des équipes
  - Accès aux analyses et rapports
  - Gestion des pointages
  - Gestion des congés

### 2. **RH** 🟣
- **Accès complet** à toutes les fonctionnalités (avec limitations backend)
- **Permissions** :
  - Gestion complète des employés
  - Gestion des références
  - Gestion des équipes
  - Accès aux analyses et rapports
  - Gestion des pointages
  - Gestion des congés
  - Accès limité à certaines actions (géré par le backend)

### 3. **Superviseur** 🟡
- **Accès limité** aux fonctionnalités de gestion d'équipe
- **Permissions** :
  - Gestion des employés
  - Accès aux analyses
  - Gestion des congés

### 4. **Employé** 🔵
- **Accès basique** aux fonctionnalités personnelles
- **Permissions** :
  - Consultation du dashboard
  - Gestion de ses congés
  - Accès à ses analyses personnelles

## Configuration des Menus

Les menus de la sidebar s'adaptent automatiquement selon le rôle de l'utilisateur connecté :

 ```typescript
 // Dans src/components/SideBar.tsx
 const MENU_CONFIG = {
   Admin: [
     { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
     { path: '/employe', label: 'Employés', icon: <PeopleIcon /> },
     { path: '/ref', label: 'Références', icon: <LocationCityIcon /> },
     { path: '/equipes', label: 'Equipes', icon: <Diversity3TwoToneIcon /> },
     { path: '/pointages', label: 'Pointages', icon: <FingerprintIcon /> },
     { path: '/analyses', label: 'Analyses', icon: <DetailsIcon /> },
     { path: '/conges', label: 'Congés', icon: <InsertInvitationIcon /> }
   ],
   RH: [
     { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
     { path: '/employe', label: 'Employés', icon: <PeopleIcon /> },
     { path: '/ref', label: 'Références', icon: <LocationCityIcon /> },
     { path: '/equipes', label: 'Equipes', icon: <Diversity3TwoToneIcon /> },
     { path: '/pointages', label: 'Pointages', icon: <FingerprintIcon /> },
     { path: '/analyses', label: 'Analyses', icon: <DetailsIcon /> },
     { path: '/conges', label: 'Congés', icon: <InsertInvitationIcon /> }
   ],
   Superviseur: [
     { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
     { path: '/employe', label: 'Employés', icon: <PeopleIcon /> },
     { path: '/analyses', label: 'Analyses', icon: <DetailsIcon /> },
     { path: '/conges', label: 'Congés', icon: <InsertInvitationIcon /> }
   ],
   Employe: [
     { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
     { path: '/conges', label: 'Congés', icon: <InsertInvitationIcon /> }
   ]
 };
 ```

## Protection des Routes

### Protection de base (authentification)
```typescript
<Route element={
  <ProtectedRoute>
    <AdminLayout />
  </ProtectedRoute> 
}>
```

 ### Protection par rôle
 ```typescript
 <Route path="/employe" element={
   <ProtectedRoute allowedRoles={['Admin', 'RH']}>
     <EmployePage />
   </ProtectedRoute>
 } />

 <Route path="/equipes" element={
   <ProtectedRoute allowedRoles={['Admin', 'RH', 'Superviseur']}>
     <TeamManager />
   </ProtectedRoute>
 } />

 <Route path="/analyses" element={
   <ProtectedRoute allowedRoles={['Admin', 'RH', 'Superviseur', 'Employe']}>
     <Analyse />
   </ProtectedRoute>
 } />
 ```

## Utilisation dans les Composants

### Vérification du rôle
```typescript
import { useAuth } from '../config/authConfig';

function MonComposant() {
  const { user, hasRole, hasAnyRole } = useAuth();

  // Vérifier un rôle spécifique
  if (hasRole('admin')) {
    // Code pour admin uniquement
  }

  // Vérifier plusieurs rôles
  if (hasAnyRole(['admin', 'superviseur'])) {
    // Code pour admin ou superviseur
  }

  return (
    <div>
      {user && <p>Connecté en tant que : {user.role}</p>}
    </div>
  );
}
```

 ### Affichage conditionnel
 ```typescript
 function MonComposant() {
   const { hasRole, hasAnyRole } = useAuth();

   return (
     <div>
       <h1>Page de gestion</h1>
       
               {/* Actions Admin uniquement */}
        {hasRole('Admin') && (
          <Button variant="contained" color="error">
            Supprimer l'employé
          </Button>
        )}
        
        {/* Actions Admin et RH */}
        {hasAnyRole(['Admin', 'RH']) && (
          <Button variant="contained" color="primary">
            Modifier l'employé
          </Button>
        )}
        
        {/* Actions Admin, RH et Superviseur */}
        {hasAnyRole(['Admin', 'RH', 'Superviseur']) && (
          <Button variant="contained" color="secondary">
            Voir les détails
          </Button>
        )}
       
       {/* Actions pour tous les rôles */}
       <Button variant="outlined">
         Consulter
       </Button>
     </div>
   );
 }
 ```

 ## Composants Utilitaires

### RoleInfo
Utilisez le composant `RoleInfo` pour afficher les informations de l'utilisateur connecté :

```typescript
import RoleInfo from '../components/RoleInfo';

function Dashboard() {
  return (
    <div>
      <RoleInfo showDetails={true} />
      {/* Contenu du dashboard */}
    </div>
  );
}
```

### RoleBasedActions
Utilisez le composant `RoleBasedActions` pour afficher des actions conditionnelles selon le rôle :

```typescript
import RoleBasedActions from '../components/RoleBasedActions';

function EmployePage() {
  const handleAdd = () => {};
const handleEdit = () => {};
const handleDelete = () => {};
const handleView = () => {};

  return (
    <div>
      <RoleBasedActions
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
      {/* Contenu de la page */}
    </div>
  );
}
```

## Gestion des Erreurs

### Page d'accès refusé
Si un utilisateur tente d'accéder à une page pour laquelle il n'a pas les permissions, il sera redirigé vers `/unauthorized`.

### Redirection automatique
- Les utilisateurs non connectés sont redirigés vers la page de login
- Les utilisateurs sans permissions sont redirigés vers la page d'erreur

## Structure des Données Utilisateur

 ```typescript
 interface IUser {
   matricule: string;
   nom: string;
   prenom: string;
   email: string;
   phone: string;
   badge: string;
   empreinte: string;
   poste: string;
   type_contrat: string;
   date_embauche: string;
   date_fin_contrat: string;
   id_lieu: number;
   id_equipe: number;
   id_departement: number;
   role: string; // 'Admin', 'RH', 'Superviseur', 'Employe'
 }
 ```

## Bonnes Pratiques

1. **Toujours vérifier les permissions** avant d'afficher du contenu sensible
2. **Utiliser les hooks** `hasRole` et `hasAnyRole` pour les vérifications
3. **Protéger les routes** avec `ProtectedRoute` et `allowedRoles`
4. **Afficher des messages d'erreur** appropriés pour les utilisateurs non autorisés
5. **Tester** l'application avec différents rôles pour s'assurer du bon fonctionnement

## Ajout de Nouveaux Rôles

Pour ajouter un nouveau rôle :

1. Ajouter le rôle dans `MENU_CONFIG` dans `SideBar.tsx`
2. Mettre à jour les permissions dans `RoleInfo.tsx`
3. Ajouter les protections de routes nécessaires dans `App.tsx`
4. Tester avec différents utilisateurs
