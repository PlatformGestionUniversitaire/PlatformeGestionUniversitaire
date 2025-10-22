# Authentication System

## Architecture de Sécurité

### Authentification Sans Sélection de Rôle

Le système d'authentification a été conçu pour être sécurisé :

- **Pas de sélection de rôle** lors du login ou de l'inscription
- Le rôle est **stocké dans la base de données** et assigné uniquement par l'admin
- Redirection automatique selon le rôle après connexion

## Rôles Disponibles

```typescript
type UserRole = 'student' | 'teacher' | 'admin' | 'director';
```

### Redirections Automatiques

Après connexion, l'utilisateur est automatiquement redirigé vers son dashboard :

- `student` → `/student/dashboard`
- `teacher` → `/teacher/dashboard`
- `admin` → `/admin/dashboard`
- `director` → `/director/dashboard`

## Inscription Publique

### Option 1 : Auto-inscription activée (par défaut)

- Les utilisateurs peuvent s'inscrire eux-mêmes
- Rôle automatiquement assigné : **`student`**
- Les autres rôles ne peuvent être créés que par l'admin

### Option 2 : Désactiver l'inscription publique

Pour désactiver complètement l'auto-inscription :

1. Dans `register.component.ts`, décommentez la ligne dans `ngOnInit()` :
   ```typescript
   this.router.navigate(['/auth/login']);
   ```

2. Ou masquez le lien "Create Account" dans `login.component.html`

3. Ou supprimez la route `/auth/register` dans `auth-routing.module.ts`

## Gestion des Utilisateurs par l'Admin

L'administrateur doit avoir une interface pour :

### 1. Créer des Comptes

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin' | 'director';
}
```

### 2. Fonctionnalités Requises

- ✅ Créer un nouvel utilisateur avec un rôle spécifique
- ✅ Modifier le rôle d'un utilisateur existant
- ✅ Réinitialiser le mot de passe
- ✅ Activer/Désactiver un compte
- ✅ Lister tous les utilisateurs par rôle

### 3. Exemple d'Implémentation

Créez un service admin pour gérer les utilisateurs :

```typescript
// src/app/features/admin/services/user-management.service.ts
@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private API_URL = '/api/admin/users';

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}`, userData);
  }

  updateUserRole(userId: string, role: UserRole): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${userId}/role`, { role });
  }

  listUsers(role?: UserRole): Observable<User[]> {
    const params = role ? { role } : {};
    return this.http.get<User[]>(`${this.API_URL}`, { params });
  }
}
```

## Vérification des Rôles

### Dans les Guards

```typescript
// auth.guard.ts
canActivate(route: ActivatedRouteSnapshot): boolean {
  const allowedRoles = route.data['roles'] as UserRole[];
  return this.authService.hasAnyRole(allowedRoles);
}
```

### Dans les Routes

```typescript
{
  path: 'admin',
  canActivate: [AuthGuard],
  data: { roles: ['admin'] },
  loadChildren: () => import('./features/admin/admin.module')
}
```

### Dans les Composants

```typescript
// Vérifier un rôle spécifique
if (this.authService.hasRole('admin')) {
  // Code réservé aux admins
}

// Vérifier plusieurs rôles
if (this.authService.hasAnyRole(['admin', 'director'])) {
  // Code pour admin et director
}
```

## Sécurité Backend

⚠️ **Important** : Ne faites JAMAIS confiance au frontend pour la sécurité !

### Vérifications Côté Backend Requises

1. **Lors de la création d'utilisateur** :
   ```typescript
   // Seul un admin peut créer des utilisateurs avec role != 'student'
   if (requestingUser.role !== 'admin' && newUser.role !== 'student') {
     throw new UnauthorizedException();
   }
   ```

2. **Lors de la modification de rôle** :
   ```typescript
   // Seul un admin peut modifier les rôles
   if (requestingUser.role !== 'admin') {
     throw new UnauthorizedException();
   }
   ```

3. **Pour chaque endpoint protégé** :
   ```typescript
   @UseGuards(RolesGuard)
   @Roles('admin')
   async createUser(@Body() userData: CreateUserDto) {
     // ...
   }
   ```

## Flux d'Authentification

```
┌─────────────┐
│   Login     │
│  (email +   │
│  password)  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Backend Auth   │
│  Verify + JWT   │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│  Return User +   │
│  Token + Role    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Frontend Redirection    │
│  Based on Role:          │
│  - student → /student    │
│  - teacher → /teacher    │
│  - admin → /admin        │
│  - director → /director  │
└──────────────────────────┘
```

## TODO : Interface Admin

Pour compléter l'implémentation, créez dans `src/app/features/admin/` :

- [ ] `components/user-management/` - Interface CRUD pour les utilisateurs
- [ ] `components/user-creation-form/` - Formulaire avec sélection de rôle
- [ ] `components/users-list/` - Liste avec filtres par rôle
- [ ] `services/user-management.service.ts` - Gestion des utilisateurs

## Exemple de Formulaire Admin

```html
<!-- user-creation-form.component.html -->
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <input formControlName="name" placeholder="Full Name" />
  <input formControlName="email" type="email" placeholder="Email" />
  <input formControlName="password" type="password" placeholder="Password" />
  
  <!-- Sélection de rôle - UNIQUEMENT pour les admins -->
  <select formControlName="role">
    <option value="student">Student</option>
    <option value="teacher">Teacher</option>
    <option value="admin">Admin</option>
    <option value="director">Director</option>
  </select>
  
  <button type="submit">Create User</button>
</form>
```
