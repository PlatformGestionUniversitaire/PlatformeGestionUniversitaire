import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DirectorService } from '../../services/director.service';
import { DepartmentStats, AbsenceReport } from '../../models/director.models';

@Component({
  selector: 'app-director-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './director-dashboard.component.html',
  styleUrls: ['./director-dashboard.component.css']
})
export class DirectorDashboardComponent implements OnInit {
  stats: DepartmentStats = {
    totalStudents: 245,
    totalTeachers: 18,
    totalSubjects: 32,
    totalGroups: 8,
    absenteeismRate: 12.5,
    averageGrade: 14.2,
    roomOccupancyRate: 78.3,
    conflictsCount: 3
  };
  recentAbsences: AbsenceReport[] = [];
  loading = false; // Start with false to show content immediately
  
  quickActions = [
    {
      title: 'Emplois du temps',
      description: 'Créer et gérer les emplois du temps',
      icon: 'schedule',
      route: '/director/timetable',
      color: 'primary'
    },
    {
      title: 'Conflits',
      description: 'Résoudre les conflits d\'emploi',
      icon: 'warning',
      route: '/director/conflicts',
      color: 'warn',
      badge: 3
    },
    {
      title: 'Matières',
      description: 'Administrer les matières',
      icon: 'book',
      route: '/director/subjects',
      color: 'accent'
    },
    {
      title: 'Groupes',
      description: 'Gérer les groupes d\'étudiants',
      icon: 'group',
      route: '/director/groups',
      color: 'primary'
    },
    {
      title: 'Rattrapages',
      description: 'Gérer les séances de rattrapage',
      icon: 'event_available',
      route: '/director/makeup',
      color: 'accent'
    },
    {
      title: 'Statistiques',
      description: 'Voir les statistiques détaillées',
      icon: 'analytics',
      route: '/director/stats',
      color: 'primary'
    }
  ];

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Charger les statistiques du département
    this.directorService.getDepartmentStats('dept-1').subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
        // Provide fallback mock data
        this.stats = {
          totalStudents: 245,
          totalTeachers: 18,
          totalSubjects: 32,
          totalGroups: 8,
          absenteeismRate: 12.5,
          averageGrade: 14.2,
          roomOccupancyRate: 78.3,
          conflictsCount: 3
        };
      }
    });

    // Charger les absences récentes
    this.directorService.getAbsenceReports('dept-1', 'week').subscribe({
      next: (reports) => {
        this.recentAbsences = reports;
      },
      error: (error) => {
        console.error('Error loading absence reports:', error);
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getStatIcon(label: string): string {
    switch (label.toLowerCase()) {
      case 'étudiants': return 'people';
      case 'enseignants': return 'school';
      case 'matières': return 'book';
      case 'groupes': return 'group_work';
      case 'absences': return 'person_off';
      case 'moyenne': return 'grade';
      case 'salles': return 'meeting_room';
      case 'conflits': return 'warning';
      default: return 'info';
    }
  }
}
