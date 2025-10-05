import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent) },

	// Auth routes - lazy-load standalone components
	{
		path: 'auth',
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
			{ path: 'login', loadComponent: () => import('./core/auth/components/login/login.component').then(m => m.LoginComponent) },
			{ path: 'register', loadComponent: () => import('./core/auth/components/register/register.component').then(m => m.RegisterComponent) }
		]
	},

	// Feature areas (lazy-loaded standalone dashboards)
	{ path: 'student', loadComponent: () => import('./features/student/pages/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent) },
	{ path: 'teacher', loadComponent: () => import('./features/teacher/pages/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent) },
	{ path: 'director', loadComponent: () => import('./features/director/pages/director-dashboard/director-dashboard.component').then(m => m.DirectorDashboardComponent) },
	{ path: 'admin', loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },

	{ path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
