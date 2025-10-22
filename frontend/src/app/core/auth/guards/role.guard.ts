import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Vérifier d'abord si l'utilisateur est authentifié
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Récupérer les rôles autorisés depuis les données de la route
    const allowedRoles = route.data['roles'] as UserRole[];
    
    if (!allowedRoles || allowedRoles.length === 0) {
      // Aucun rôle spécifié, autoriser l'accès
      return true;
    }

    // Vérifier si l'utilisateur a l'un des rôles autorisés
    if (this.authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    // L'utilisateur n'a pas les permissions nécessaires
    // Rediriger vers son propre dashboard
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const redirectRoutes: Record<UserRole, string> = {
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
        admin: '/admin/dashboard',
        director: '/director/dashboard'
      };
      this.router.navigate([redirectRoutes[currentUser.role]]);
    } else {
      this.router.navigate(['/auth/login']);
    }
    
    return false;
  }
}
