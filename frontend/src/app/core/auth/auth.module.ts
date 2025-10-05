import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// This module intentionally does not declare standalone components.
// Instead it exposes child routes that lazy-load the standalone login/register components.
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthModule {}