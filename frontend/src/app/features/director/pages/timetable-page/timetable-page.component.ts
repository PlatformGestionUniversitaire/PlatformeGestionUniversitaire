import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableManagementComponent } from '../../components/timetable-management/timetable-management.component';

@Component({
  selector: 'app-timetable-page',
  standalone: true,
  imports: [CommonModule, TimetableManagementComponent],
  template: '<app-timetable-management></app-timetable-management>'
})
export class TimetablePageComponent {}