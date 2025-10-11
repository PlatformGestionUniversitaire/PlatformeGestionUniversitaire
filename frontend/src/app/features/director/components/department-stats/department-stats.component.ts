import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DirectorService } from '../../services/director.service';
import { DepartmentStats, StudentPerformance, AbsenceReport } from '../../models/director.models';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-department-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatProgressBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
],
  templateUrl: './department-stats.component.html',
  styleUrls: ['./department-stats.component.css']
})
export class DepartmentStatsComponent implements OnInit {
  stats: DepartmentStats | null = null;
  studentPerformances: StudentPerformance[] = [];
  absenceReports: AbsenceReport[] = [];
  loading = true;
  
  selectedPeriod = 'month';
  performanceColumns: string[] = ['rank', 'student', 'group', 'average', 'attendance', 'actions'];
  
  periodOptions = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'semester', label: 'Ce semestre' },
    { value: 'year', label: 'Cette année' }
  ];

  constructor(private directorService: DirectorService) {}

  ngOnInit() {
    this.loadStats();
    this.loadStudentPerformances();
    this.loadAbsenceReports();
  }

  loadStats() {
    this.directorService.getDepartmentStats('dept-1').subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }

  loadStudentPerformances() {
    this.directorService.getStudentPerformances('dept-1').subscribe({
      next: (performances) => {
        this.studentPerformances = performances;
      },
      error: (error) => {
        console.error('Error loading student performances:', error);
      }
    });
  }

  loadAbsenceReports() {
    this.directorService.getAbsenceReports('dept-1', this.selectedPeriod).subscribe({
      next: (reports) => {
        this.absenceReports = reports;
      },
      error: (error) => {
        console.error('Error loading absence reports:', error);
      }
    });
  }

  onPeriodChange() {
    this.loadAbsenceReports();
  }

  exportReport(type: string) {
    console.log(`Exporting ${type} report...`);
    // Logique d'export à implémenter
  }

  getPerformanceColor(average: number): string {
    if (average >= 16) return 'primary';
    if (average >= 12) return 'accent';
    if (average >= 10) return 'warn';
    return 'warn';
  }

  getAttendanceColor(rate: number): string {
    if (rate >= 90) return 'primary';
    if (rate >= 80) return 'accent';
    return 'warn';
  }

  getRoomOccupancyStatus(): string {
    if (!this.stats) return 'normal';
    if (this.stats.roomOccupancyRate >= 90) return 'high';
    if (this.stats.roomOccupancyRate >= 70) return 'medium';
    return 'low';
  }

  getAbsenteeismStatus(): string {
    if (!this.stats) return 'normal';
    if (this.stats.absenteeismRate >= 20) return 'critical';
    if (this.stats.absenteeismRate >= 15) return 'warning';
    if (this.stats.absenteeismRate >= 10) return 'attention';
    return 'good';
  }
}
