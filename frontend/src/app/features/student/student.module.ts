import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { TimetableComponent } from './components/timetable/timetable.component';

// Services
import { StudentService } from './services/student.service';
import { MessagingService } from './services/messaging.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StudentRoutingModule,
    StudentDashboardComponent,
    TimetableComponent
  ],
  providers: [
    StudentService,
    MessagingService
  ]
})
export class StudentModule { }
