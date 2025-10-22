# Guide d'Utilisation - Système d'Authentification

## 🎯 Résumé des Modifications

Votre système d'authentification a été modifié pour **NE PAS** avoir de sélection de rôle lors du login/register. Le rôle est maintenant géré uniquement par le backend et l'admin.

## 📦 Ce qui a été implémenté

### 1. **Modèle User avec Rôles Typés**
- ✅ `UserRole = 'student' | 'teacher' | 'admin' | 'director'`
- ✅ Interface `User` avec rôle obligatoire
- ✅ `LoginRequest` sans champ rôle
- ✅ `RegisterRequest` sans champ rôle

### 2. **AuthService Complet**
- ✅ `login()` - Connexion sans sélection de rôle
- ✅ `register()` - Inscription avec rôle "student" automatique
- ✅ `hasRole()` - Vérifier un rôle spécifique
- ✅ `hasAnyRole()` - Vérifier plusieurs rôles
- ✅ Redirection automatique selon le rôle

### 3. **Composants Auth Mis à Jour**
- ✅ Login avec email (pas username)
- ✅ Register avec name (pas username)
- ✅ Aucune sélection de rôle visible

### 4. **Guards de Sécurité**
- ✅ `AuthGuard` - Protège les routes authentifiées
- ✅ `RoleGuard` - Protège selon les rôles

### 5. **Interface Admin**
- ✅ `UserManagementService` - CRUD complet des utilisateurs
- ✅ `UserCreationFormComponent` - Formulaire avec sélection de rôle (pour admin)
- ✅ `HasRoleDirective` - Affichage conditionnel selon le rôle

## 🚀 Comment Utiliser

### Pour les Utilisateurs (Login)

```typescript
// Le formulaire de login demande uniquement :
{
  email: string;     // Ex: "etudiant@univ.com"
  password: string;  // Ex: "password123"
}

// Après connexion, redirection automatique :
// - student   → /student/dashboard
// - teacher   → /teacher/dashboard
// - admin     → /admin/dashboard
// - director  → /director/dashboard
```

### Pour l'Admin (Créer des Utilisateurs)

```typescript
// L'admin utilise le composant UserCreationFormComponent
// qui permet de sélectionner le rôle :
{
  name: "John Doe",
  email: "john@example.com",
  password: "securepass123",
  role: "teacher"  // Sélection disponible uniquement pour l'admin
}
```

### Dans les Routes

```typescript
// app.routes.ts ou feature-routing.module.ts
import { RoleGuard } from './core/auth/guards/role.guard';

export const routes: Routes = [
  // Route accessible uniquement aux admins
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./features/admin/admin.module')
  },
  
  // Route accessible aux admins ET directors
  {
    path: 'reports',
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'director'] },
    loadComponent: () => import('./pages/reports/reports.component')
  },
  
  // Route accessible à tous les utilisateurs authentifiés
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/profile/profile.component')
  }
];
```

### Dans les Templates (avec *hasRole)

```html
<!-- Afficher uniquement pour les admins -->
<button *hasRole="'admin'" (click)="deleteUser()">
  Delete User
</button>

<!-- Afficher pour admin OU director -->
<div *hasRole="['admin', 'director']">
  <h3>Management Dashboard</h3>
  <app-reports></app-reports>
</div>

<!-- Masquer pour les étudiants -->
<div *hasRole="'student'; hideFor: true">
  This content is hidden for students
</div>

<!-- Afficher pour les enseignants -->
<section *hasRole="'teacher'">
  <app-grade-management></app-grade-management>
</section>
```

### Dans les Composants (TypeScript)

```typescript
import { AuthService } from './core/auth/services/auth.service';

export class MyComponent {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Vérifier un rôle spécifique
    if (this.authService.hasRole('admin')) {
      console.log('User is admin');
    }

    // Vérifier plusieurs rôles
    if (this.authService.hasAnyRole(['admin', 'director'])) {
      this.loadManagementData();
    }

    // Obtenir l'utilisateur actuel
    const user = this.authService.getCurrentUser();
    console.log('Current role:', user?.role);

    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        console.log('User logged in:', user.name);
      }
    });
  }

  someMethod() {
    // Exemple d'utilisation conditionnelle
    const isAdmin = this.authService.hasRole('admin');
    
    if (isAdmin) {
      // Code réservé aux admins
      this.showAdminPanel();
    } else {
      // Code pour les autres utilisateurs
      this.showUserPanel();
    }
  }
}
```

## 🔐 Options d'Inscription

### Option 1 : Auto-inscription Activée (Par défaut)

Les utilisateurs peuvent s'inscrire avec le rôle "student" automatiquement.

**Aucune action nécessaire** - C'est déjà configuré.

### Option 2 : Désactiver l'Inscription Publique

Si vous voulez que **seul l'admin** crée les comptes :

```typescript
// Dans register.component.ts, ligne ~32 (dans ngOnInit)
ngOnInit(): void {
  // Décommenter cette ligne pour désactiver l'inscription
  this.router.navigate(['/auth/login']);
  
  // ... reste du code
}
```

Ou masquez le lien "Create Account" dans le login :

```html
<!-- Dans login.component.html, commentez cette section -->
<!--
<div class="helpful-links">
  <p class="links-title">Don't have an account?</p>
  <div class="links">
    <a (click)="goToRegister()" class="link">Create Account</a>
  </div>
</div>
-->
```

## 📋 Interface Admin - Gestion des Utilisateurs

Pour utiliser le composant de création d'utilisateur dans votre dashboard admin :

```typescript
// admin-dashboard.component.ts
import { UserCreationFormComponent } from '../components/user-creation-form/user-creation-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, UserCreationFormComponent],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <app-user-creation-form
        (userCreated)="onUserCreated()"
        (cancelled)="onCancel()">
      </app-user-creation-form>
    </div>
  `
})
export class AdminDashboardComponent {
  onUserCreated() {
    console.log('User created successfully');
    // Rafraîchir la liste des utilisateurs
  }
  
  onCancel() {
    console.log('User creation cancelled');
  }
}
```

## 🛠️ Backend - Ce qu'il faut implémenter

### Endpoints Requis

```typescript
// Authentication
POST   /api/auth/login
POST   /api/auth/register  (optionnel)
POST   /api/auth/logout
GET    /api/auth/me

// User Management (Admin only)
POST   /api/admin/users
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id
PATCH  /api/admin/users/:id/role
DELETE /api/admin/users/:id
POST   /api/admin/users/:id/reset-password
```

### Exemple de Réponse Login

```json
{
  "user": {
    "id": "123",
    "email": "etudiant@univ.com",
    "name": "Jean Dupont",
    "role": "student",
    "createdAt": "2025-10-22T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Sécurité Backend (CRITIQUE)

```typescript
// Middleware de vérification du rôle
function requireRole(...roles: UserRole[]) {
  return (req, res, next) => {
    const user = req.user; // Depuis le token JWT
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }
    
    next();
  };
}

// Utilisation
app.post('/api/admin/users', 
  authenticateToken,
  requireRole('admin'),
  createUserController
);

// Validation lors de la création
app.post('/api/admin/users', async (req, res) => {
  const { role } = req.body;
  const requestingUser = req.user;
  
  // Seul un admin peut créer des comptes non-student
  if (requestingUser.role !== 'admin' && role !== 'student') {
    return res.status(403).json({ 
      error: 'Only admins can create non-student accounts' 
    });
  }
  
  // Créer l'utilisateur...
});
```

## ✅ Vérification Finale

Vérifiez que tout fonctionne :

1. **Login** :
   - [ ] Champs : email + password (pas de rôle)
   - [ ] Redirection automatique selon le rôle
   - [ ] Token stocké dans localStorage

2. **Register** (si activé) :
   - [ ] Champs : name + email + password (pas de rôle)
   - [ ] Rôle "student" assigné automatiquement
   - [ ] Redirection vers login après inscription

3. **Admin Dashboard** :
   - [ ] Formulaire avec sélection de rôle
   - [ ] Peut créer des utilisateurs avec tous les rôles
   - [ ] Liste et gestion des utilisateurs

4. **Guards** :
   - [ ] Routes protégées par AuthGuard
   - [ ] Routes avec RoleGuard vérifient les rôles
   - [ ] Redirection appropriée si accès refusé

5. **Directive *hasRole** :
   - [ ] Masque/affiche selon le rôle
   - [ ] Fonctionne avec un seul rôle
   - [ ] Fonctionne avec plusieurs rôles

## 📞 Support

Si vous avez des questions ou besoin d'aide :

- Consultez `src/app/core/auth/README.md` pour la documentation complète
- Consultez `IMPLEMENTATION.md` pour le résumé des changements
- Vérifiez les exemples dans les composants créés

## 🎉 C'est Prêt !

Votre système d'authentification est maintenant configuré sans sélection de rôle au login/register. 

**Seul l'admin peut attribuer les rôles** via l'interface de gestion des utilisateurs.
