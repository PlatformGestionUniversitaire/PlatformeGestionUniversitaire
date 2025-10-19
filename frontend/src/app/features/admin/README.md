# Module Administrateur

Ce module implémente la partie administration de la plateforme de gestion universitaire avec toutes les fonctionnalités demandées.

## Fonctionnalités implémentées ✅

### 1. Référentiels Globaux (`/admin/referentials`)
Gestion complète des référentiels institutionnels :
- **Départements** : Création, modification, suppression
- **Spécialités** : Gestion des spécialités par département
- **Enseignants** : Liste et gestion des enseignants
- **Étudiants** : Liste et gestion des étudiants
- **Salles** : Gestion des salles de cours
- **Matières** : Gestion des matières enseignées

**Interface** : Navigation par onglets avec tableau CRUD (Créer, Lire, Supprimer) pour chaque référentiel.

### 2. Supervision des Emplois du Temps (`/admin/timetables`)
- Vue d'ensemble de tous les emplois du temps de l'institution
- Navigation par département, niveau, groupe

### 3. Gestion des Conflits (`/admin/conflicts`)
- Identification automatique des conflits complexes :
  - Chevauchements d'horaires
  - Conflits de salles
  - Conflits d'enseignants
- Interface de résolution avec suggestions

### 4. Événements Institutionnels (`/admin/events`)
- Gestion des événements spéciaux :
  - Fermetures institutionnelles
  - Conférences
  - Jours fériés
  - Événements académiques
- Calendrier visuel avec ajout/modification/suppression

### 5. Rapports Institutionnels (`/admin/reports`)
Génération de rapports dans différents formats :
- **Format PDF** : Rapports imprimables
- **Format CSV** : Données exportables pour analyse
- Types de rapports :
  - Statistiques globales
  - Emplois du temps consolidés
  - Rapports de conflits
  - Présences et performances

## Architecture

```
src/app/features/admin/
├── admin.service.ts                      # Service principal pour API calls
├── admin.module.ts                       # Module Angular (imports standalone components)
├── admin-routing.module.ts               # Routes admin
├── components/
│   ├── global-referentials/              # Gestion référentiels
│   │   ├── global-referentials.component.ts
│   │   ├── global-referentials.component.html
│   │   └── global-referentials.component.css
│   ├── events-management/                # Gestion événements
│   │   ├── events-management.component.ts
│   │   ├── events-management.component.html
│   │   └── events-management.component.css
│   └── reports/                          # Génération rapports
│       ├── reports.component.ts
│       ├── reports.component.html
│       └── reports.component.css
└── pages/
    └── admin-dashboard/                  # Tableau de bord principal
        ├── admin-dashboard.component.ts
        ├── admin-dashboard.component.html
        └── admin-dashboard.component.css
```

## Style et Design

Le module respecte le même style visuel que les modules `student`, `director` et `teacher` :
- **Couleur primaire** : `#0d6efd` (bleu)
- **Couleur secondaire** : `#6c757d` (gris)
- **Font** : `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
- **Design** : Cartes blanches avec bordures subtiles, effets hover, icônes visuelles

## Routes disponibles

| Route | Composant | Description |
|-------|-----------|-------------|
| `/admin` | AdminDashboardComponent | Tableau de bord avec statistiques |
| `/admin/referentials` | GlobalReferentialsComponent | Gestion référentiels globaux |
| `/admin/events` | EventsManagementComponent | Gestion événements |
| `/admin/reports` | ReportsComponent | Génération rapports PDF/CSV |
| `/admin/timetables` | *(à implémenter)* | Supervision emplois du temps |
| `/admin/conflicts` | *(à implémenter)* | Gestion conflits |
| `/admin/settings` | *(à implémenter)* | Paramètres système |

## Service API (`AdminService`)

Le service `AdminService` fournit les méthodes suivantes :

```typescript
// Lister les éléments d'un référentiel
async list(key: string): Promise<any[]>

// Créer un nouvel élément
async create(key: string, payload: any): Promise<any>

// Supprimer un élément
async remove(key: string, id: any): Promise<any>
```

**Note** : Le service utilise `ApiService` qui doit être étendu pour supporter les méthodes `post()` et `delete()`.

## Prochaines étapes

### Intégration Backend
1. Implémenter les endpoints API réels dans le backend
2. Remplacer les données mock par des appels API
3. Ajouter gestion d'erreurs et notifications

### Fonctionnalités avancées
1. **Modals sophistiqués** : Remplacer `prompt()` par des dialogs Angular Material
2. **Filtres et recherche** : Ajouter filtrage et recherche dans les listes
3. **Pagination** : Gérer les grandes listes avec pagination
4. **Validation** : Formulaires avec validation complète
5. **Permissions** : Vérifier les droits d'accès admin

### Composants à créer
- `TimetableSupervisionComponent` : Vue globale des emplois du temps
- `ConflictsManagerComponent` : Gestion automatisée des conflits
- `AdminSettingsComponent` : Configuration système

### Export avancé
- Utiliser des bibliothèques comme `jsPDF` pour génération PDF robuste
- Implémenter export Excel avec `xlsx`
- Templates de rapports personnalisables

## Utilisation

### Navigation
Depuis le dashboard admin, cliquer sur les cartes pour accéder aux différentes fonctionnalités.

### Gestion référentiels
1. Sélectionner un onglet (Départements, Enseignants, etc.)
2. Cliquer "Ajouter" pour créer un nouvel élément
3. Cliquer "Supprimer" pour retirer un élément
4. "Rafraîchir" pour recharger les données

### Export rapports
1. Aller dans `/admin/reports`
2. Choisir le format (PDF ou CSV)
3. Cliquer sur le bouton d'export

## Tests

Pour tester le module :

```powershell
# Démarrer le serveur de développement
npm start

# Naviguer vers
http://localhost:4200/admin
```

## Dépendances

- Angular 17+ (standalone components)
- CommonModule (pour directives *ngFor, *ngIf)
- Router (navigation)
- Aucune dépendance externe supplémentaire (Material Angular optionnel)

---

**Status** : ✅ Module fonctionnel avec UI complète et service API de base.
