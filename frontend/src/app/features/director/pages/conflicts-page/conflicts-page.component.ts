import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DirectorService } from '../../services/director.service';
import { TimetableConflict } from '../../models/director.models';

@Component({
  selector: 'app-conflicts-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="conflicts-page">
      <!-- Floating Shapes Background -->
      <div class="floating-shapes" aria-hidden="true">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>

      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Résolution des Conflits</h1>
          <p class="subtitle">Gérer et résoudre les conflits d'emplois du temps</p>
        </div>
      </div>

      <!-- Content -->
      <div class="content-container">
        <mat-card class="conflicts-card" *ngIf="conflicts.length > 0">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">warning</mat-icon>
            <mat-card-title>Conflits Détectés</mat-card-title>
            <mat-card-subtitle>{{ conflicts.length }} conflit(s) nécessite(nt) votre attention</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="conflicts-list">
              <div *ngFor="let conflict of conflicts" class="conflict-item" [class]="'severity-' + conflict.severity.toLowerCase()">
                <div class="conflict-header">
                  <div class="conflict-type">
                    <mat-icon>{{ getConflictIcon(conflict.type) }}</mat-icon>
                    <span>{{ getConflictTypeLabel(conflict.type) }}</span>
                  </div>
                  <mat-chip [color]="getSeverityColor(conflict.severity)">
                    {{ getSeverityLabel(conflict.severity) }}
                  </mat-chip>
                </div>
                
                <div class="conflict-description">
                  {{ conflict.description }}
                </div>
                
                <div class="conflict-suggestion" *ngIf="conflict.suggestedSolution">
                  <mat-icon>lightbulb</mat-icon>
                  <span>{{ conflict.suggestedSolution }}</span>
                </div>
                
                <div class="conflict-actions">
                  <button mat-button color="primary" (click)="resolveConflict(conflict)">
                    <mat-icon>build</mat-icon>
                    Résoudre
                  </button>
                  <button mat-button (click)="viewDetails(conflict)">
                    <mat-icon>visibility</mat-icon>
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- No Conflicts State -->
        <mat-card class="no-conflicts-card" *ngIf="conflicts.length === 0">
          <mat-card-content>
            <div class="no-conflicts">
              <mat-icon>check_circle</mat-icon>
              <h2>Aucun Conflit Détecté</h2>
              <p>Tous les emplois du temps sont compatibles. Excellent travail !</p>
              <button mat-raised-button color="primary" (click)="refreshConflicts()">
                <mat-icon>refresh</mat-icon>
                Actualiser
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./conflicts-page.component.css']
})
export class ConflictsPageComponent implements OnInit {
  conflicts: TimetableConflict[] = [];

  constructor(
    private directorService: DirectorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadConflicts();
  }

  loadConflicts() {
    this.directorService.getTimetableConflicts('dept-1').subscribe({
      next: (conflicts) => {
        this.conflicts = conflicts;
      },
      error: (error) => {
        console.error('Error loading conflicts:', error);
        // Mock data pour la démonstration
        this.conflicts = [
          {
            id: '1',
            type: 'TEACHER_CONFLICT',
            description: 'Le professeur Martin a deux cours programmés en même temps le lundi à 10h00 - Salle A201 (MATH101) et Salle B105 (PHYS201)',
            affectedTimetables: ['tt1', 'tt2'],
            severity: 'HIGH',
            suggestedSolution: 'Déplacer le cours de PHYS201 à 14h00 ou changer d\'enseignant'
          },
          {
            id: '2',
            type: 'ROOM_CONFLICT',
            description: 'La salle C301 est réservée pour deux groupes différents le mercredi à 14h00',
            affectedTimetables: ['tt3', 'tt4'],
            severity: 'MEDIUM',
            suggestedSolution: 'Utiliser la salle C302 qui est disponible au même créneau'
          }
        ];
      }
    });
  }

  resolveConflict(conflict: TimetableConflict) {
    this.directorService.resolveConflict(conflict.id, {}).subscribe({
      next: () => {
        this.showMessage('Conflit résolu avec succès');
        this.loadConflicts();
      },
      error: (error) => {
        this.showMessage('Erreur lors de la résolution du conflit');
      }
    });
  }

  viewDetails(conflict: TimetableConflict) {
    this.showMessage(`Détails du conflit: ${conflict.description}`);
  }

  refreshConflicts() {
    this.loadConflicts();
    this.showMessage('Actualisation des conflits...');
  }

  getConflictIcon(type: string): string {
    switch (type) {
      case 'TEACHER_CONFLICT': return 'person';
      case 'ROOM_CONFLICT': return 'meeting_room';
      case 'GROUP_CONFLICT': return 'group';
      default: return 'warning';
    }
  }

  getConflictTypeLabel(type: string): string {
    switch (type) {
      case 'TEACHER_CONFLICT': return 'Conflit Enseignant';
      case 'ROOM_CONFLICT': return 'Conflit Salle';
      case 'GROUP_CONFLICT': return 'Conflit Groupe';
      default: return type;
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'HIGH': return 'warn';
      case 'MEDIUM': return 'accent';
      case 'LOW': return 'primary';
      default: return '';
    }
  }

  getSeverityLabel(severity: string): string {
    switch (severity) {
      case 'HIGH': return 'Critique';
      case 'MEDIUM': return 'Moyen';
      case 'LOW': return 'Faible';
      default: return severity;
    }
  }

  private showMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}