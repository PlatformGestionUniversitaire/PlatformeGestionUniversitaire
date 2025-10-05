import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/auth-page/auth-page.component').then(m => m.AuthPageComponent),
		children: [
			{ path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
			{ path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
			{ path: '', redirectTo: 'login', pathMatch: 'full' }
		]
	}
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AuthModule {}
