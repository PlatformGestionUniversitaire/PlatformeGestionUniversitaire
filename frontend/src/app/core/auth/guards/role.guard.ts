import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  canActivate(): boolean { return true; }
}
