import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class LandingComponent implements OnInit, OnDestroy {
  title = 'Plateforme Universitaire';
  usersTarget = 12000;
  users = 0;
  usersDisplay = '0';
  private _rafId: number | null = null;
  private _startTime: number | null = null;

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
  
  // Animate counter from 0 to usersTarget over duration milliseconds
  private animateUsers(duration = 1800) {
    this.users = 0;
    this._startTime = null;

    const step = (timestamp: number) => {
      if (!this._startTime) this._startTime = timestamp;
      const progress = Math.min((timestamp - this._startTime) / duration, 1);
      const eased = this.easeOutCubic(progress);
      this.users = Math.round(eased * this.usersTarget);
      this.usersDisplay = this.formatUsers(this.users, progress === 1);

      if (progress < 1) {
        this._rafId = requestAnimationFrame(step);
      } else {
        this._rafId = null;
      }
    };

    this._rafId = requestAnimationFrame(step);
  }

  private formatUsers(val: number, finished = false) {
    if (finished) return '12k+';
    if (val >= 1000) return Math.floor(val / 1000) + 'k';
    return String(val);
  }

  private easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

  ngOnInit(): void {
    // Start the users counter when component initializes
    this.animateUsers();
  }

  ngOnDestroy(): void {
    if (this._rafId != null) cancelAnimationFrame(this._rafId);
  }
}
