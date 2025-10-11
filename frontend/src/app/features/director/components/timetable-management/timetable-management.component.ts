import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DirectorService } from '../../services/director.service';
import { Timetable, TimetableConflict } from '../../models/director.models';

@Component({
  selector: 'app-timetable-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './timetable-management.component.html',
  styleUrls: ['./timetable-management.component.css']
})
export class TimetableManagementComponent implements OnInit {
  timetables: Timetable[] = [];
  conflicts: TimetableConflict[] = [];
  loading = true;
  
  displayedColumns: string[] = ['subject', 'group', 'teacher', 'time', 'room', 'status', 'actions'];
  conflictColumns: string[] = ['type', 'description', 'severity', 'actions'];
  
  daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots = [
    '08:00-09:30', '09:45-11:15', '11:30-13:00', 
    '14:00-15:30', '15:45-17:15', '17:30-19:00'
  ];

  weeklyView: any[][] = [];

  constructor(
    private directorService: DirectorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTimetables();
    this.loadConflicts();
  }

  loadTimetables() {
    this.loading = true;
    this.directorService.getTimetables('dept-1').subscribe({
      next: (timetables) => {
        this.timetables = timetables;
        this.generateWeeklyView();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading timetables:', error);
        this.loading = false;
        this.showMessage('Erreur lors du chargement des emplois du temps');
      }
    });
  }

  loadConflicts() {
    this.directorService.getTimetableConflicts('dept-1').subscribe({
      next: (conflicts) => {
        this.conflicts = conflicts;
      },
      error: (error) => {
        console.error('Error loading conflicts:', error);
      }
    });
  }

  generateWeeklyView() {
    this.weeklyView = [];
    
    this.timeSlots.forEach(timeSlot => {
      const row: any[] = [timeSlot];
      
      this.daysOfWeek.forEach((day, dayIndex) => {
        const dayTimetables = this.timetables.filter(t => 
          t.dayOfWeek === dayIndex && 
          this.getTimeSlot(t.startTime, t.endTime) === timeSlot
        );
        row.push(dayTimetables);
      });
      
      this.weeklyView.push(row);
    });
  }

  getTimeSlot(startTime: string, endTime: string): string {
    return `${startTime}-${endTime}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'VALIDATED': return 'primary';
      case 'PROPOSED': return 'accent';
      case 'REJECTED': return 'warn';
      case 'CONFLICT': return 'warn';
      default: return '';
    }
  }

  getConflictSeverityColor(severity: string): string {
    switch (severity) {
      case 'HIGH': return 'warn';
      case 'MEDIUM': return 'accent';
      case 'LOW': return 'primary';
      default: return '';
    }
  }

  validateTimetable(timetable: Timetable) {
    this.directorService.validateTimetable(timetable.id).subscribe({
      next: () => {
        this.showMessage('Emploi du temps validé avec succès');
        this.loadTimetables();
      },
      error: (error) => {
        this.showMessage('Erreur lors de la validation');
      }
    });
  }

  rejectTimetable(timetable: Timetable) {
    const reason = prompt('Raison du rejet:');
    if (reason) {
      this.directorService.rejectTimetable(timetable.id, reason).subscribe({
        next: () => {
          this.showMessage('Emploi du temps rejeté');
          this.loadTimetables();
        },
        error: (error) => {
          this.showMessage('Erreur lors du rejet');
        }
      });
    }
  }

  resolveConflict(conflict: TimetableConflict) {
    // Ouvrir un dialogue pour résoudre le conflit
    this.showMessage('Fonctionnalité de résolution de conflit à implémenter');
  }

  createNewTimetable() {
    // Ouvrir un dialogue pour créer un nouvel emploi du temps
    this.showMessage('Fonctionnalité de création d\'emploi du temps à implémenter');
  }

  exportTimetable() {
    this.showMessage('Export en cours...');
    // Logique d'export à implémenter
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
