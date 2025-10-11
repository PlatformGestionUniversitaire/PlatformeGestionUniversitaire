import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { TimetableComponent } from './components/timetable/timetable.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: StudentDashboardComponent,
    title: 'Tableau de Bord Étudiant'
  },
  {
    path: 'timetable',
    component: TimetableComponent,
    title: 'Emploi du Temps'
  },
  {
    path: 'grades',
    loadComponent: () => import('./components/grades/grades.component').then(c => c.GradesComponent),
    title: 'Mes Notes'
  },
  {
    path: 'absences',
    loadComponent: () => import('./components/absences/absences.component').then(c => c.AbsencesComponent),
    title: 'Mes Absences'
  },
  {
    path: 'messages',
    loadComponent: () => import('./components/messages/messages.component').then(c => c.MessagesComponent),
    title: 'Messagerie'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }

export const studentRoutes = routes;
