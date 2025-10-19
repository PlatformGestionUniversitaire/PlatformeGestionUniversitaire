import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { GlobalReferentialsComponent } from './components/global-referentials/global-referentials.component';
import { EventsManagementComponent } from './components/events-management/events-management.component';
import { ReportsComponent } from './components/reports/reports.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'referentials',
    component: GlobalReferentialsComponent
  },
  {
    path: 'events',
    component: EventsManagementComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'timetables',
    component: AdminDashboardComponent // placeholder - create separate component later
  },
  {
    path: 'conflicts',
    component: AdminDashboardComponent // placeholder - create separate component later
  },
  {
    path: 'settings',
    component: AdminDashboardComponent // placeholder - create separate component later
  }
];
