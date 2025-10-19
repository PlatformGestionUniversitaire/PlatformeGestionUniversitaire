import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TimetableComponent } from '../../components/timetable/timetable.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, TimetableComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) { this.router.navigate([path]); }
}
