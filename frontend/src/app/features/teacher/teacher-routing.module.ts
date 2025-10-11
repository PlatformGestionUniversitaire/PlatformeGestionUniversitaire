import { Routes } from '@angular/router';

export const teacherRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
  },
  {
    path: 'timetable',
    loadComponent: () => import('./components/timetable/timetable.component').then(m => m.TimetableComponent)
  },
  {
    path: 'absences',
    loadComponent: () => import('./components/absences/absences.component').then(m => m.AbsencesComponent)
  },
  {
    path: 'makeup',
    loadComponent: () => import('./components/makeup/makeup.component').then(m => m.MakeupComponent)
  },
  {
    path: 'messages',
    loadComponent: () => import('./components/messages/messages.component').then(m => m.MessagesComponent)
  }
];
