import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { GlobalReferentialsComponent } from './components/global-referentials/global-referentials.component';
import { EventsManagementComponent } from './components/events-management/events-management.component';
import { ReportsComponent } from './components/reports/reports.component';
import { adminRoutes } from './admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(adminRoutes),

    // Standalone components
    GlobalReferentialsComponent,
    EventsManagementComponent,
    ReportsComponent
  ],
  exports: [GlobalReferentialsComponent, EventsManagementComponent, ReportsComponent]
})
export class AdminModule {}