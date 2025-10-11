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
	{ 
		path: 'teacher',
		children: [
			{ path: '', loadComponent: () => import('./features/teacher/pages/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent) },
			{ path: 'dashboard', loadComponent: () => import('./features/teacher/pages/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent) },
			{ path: 'timetable', loadComponent: () => import('./features/teacher/components/timetable/timetable.component').then(m => m.TimetableComponent) },
			{ path: 'absences', loadComponent: () => import('./features/teacher/components/absences/absences.component').then(m => m.AbsencesComponent) },
			{ path: 'makeup', loadComponent: () => import('./features/teacher/components/makeup/makeup.component').then(m => m.MakeupComponent) },
			{ path: 'messages', loadComponent: () => import('./features/teacher/components/messages/messages.component').then(m => m.MessagesComponent) }
		]
	},
	{ 
		path: 'director',
		children: [
			{ path: '', loadComponent: () => import('./features/director/pages/director-dashboard/director-dashboard.component').then(m => m.DirectorDashboardComponent) },
			{ path: 'dashboard', loadComponent: () => import('./features/director/pages/director-dashboard/director-dashboard.component').then(m => m.DirectorDashboardComponent) },
			{ path: 'timetable', loadComponent: () => import('./features/director/pages/timetable-page/timetable-page.component').then(m => m.TimetablePageComponent) },
			{ path: 'stats', loadComponent: () => import('./features/director/pages/stats-page/stats-page.component').then(m => m.StatsPageComponent) },
			{ path: 'subjects', loadComponent: () => import('./features/director/pages/referentials-page/referentials-page.component').then(m => m.ReferentialsPageComponent) },
			{ path: 'groups', loadComponent: () => import('./features/director/pages/referentials-page/referentials-page.component').then(m => m.ReferentialsPageComponent) },
			{ path: 'makeup', loadComponent: () => import('./features/director/pages/makeup-page/makeup-page.component').then(m => m.MakeupPageComponent) },
			{ path: 'conflicts', loadComponent: () => import('./features/director/pages/conflicts-page/conflicts-page.component').then(m => m.ConflictsPageComponent) }
		]
	},
	{ path: 'admin', loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },

	{ path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
