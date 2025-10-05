import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
// MatCard usage removed — keep button/icon modules
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgForOf } from '@angular/common';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NgForOf, MatButtonModule, MatIconModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  title = 'Plateforme Universitaire';

  features = [
    { title: 'Gestion des étudiants', desc: 'Inscription, emplois du temps, notes et absences centralisés.' },
    { title: 'Espace enseignants', desc: 'Planification, évaluations et communication simple.' },
    { title: 'Tableau de bord', desc: 'Vue d’ensemble en temps réel pour les admins.' }
  ];

  openDocs() {
    window.open('https://angular.io', '_blank');
  }

  getStarted() {
    // Navigate to auth or signup page in a real app. For now, open auth route.
    window.location.href = '/auth/login';
  }
}
