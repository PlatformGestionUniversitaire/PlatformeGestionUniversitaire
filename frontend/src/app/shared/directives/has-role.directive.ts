import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserRole } from '../../core/models/user.model';

/**
 * Directive structurelle pour afficher du contenu conditionnel basé sur le rôle de l'utilisateur
 * 
 * @example
 * <!-- Afficher uniquement pour les admins -->
 * <div *hasRole="'admin'">
 *   Admin only content
 * </div>
 * 
 * @example
 * <!-- Afficher pour admin OU director -->
 * <div *hasRole="['admin', 'director']">
 *   Admin or Director content
 * </div>
 * 
 * @example
 * <!-- Masquer pour un rôle spécifique -->
 * <div *hasRole="'student'; hideFor: true">
 *   Hidden for students
 * </div>
 */
@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private roles: UserRole[] = [];
  private hideFor = false;

  @Input() set hasRole(roles: UserRole | UserRole[]) {
    this.roles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  @Input() set hasRoleHideFor(value: boolean) {
    this.hideFor = value;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements de l'utilisateur connecté
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasRequiredRole = this.authService.hasAnyRole(this.roles);
    const shouldShow = this.hideFor ? !hasRequiredRole : hasRequiredRole;

    this.viewContainer.clear();
    if (shouldShow) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
