import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
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
    path: 'messages',
    loadComponent: () => import('./components/messages/messages.component').then(m => m.MessagesComponent)
  },
  {
    path: 'grades',
    loadComponent: () => import('./components/grades/grades.component').then(m => m.GradesComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent)
  }
];
