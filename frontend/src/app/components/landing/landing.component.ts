import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';

type EventItem = { id: number; title: string; date: string; desc?: string; location?: string };

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, SharedModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
openDashboard() {
throw new Error('Method not implemented.');
}
explore // --- Contact ---
() {
throw new Error('Method not implemented.');
}
  // derived list of upcoming events (sorted, future or today)
  get upcomingEvents(): EventItem[] {
    const todayKey = new Date().toISOString().slice(0, 10);
    return this.events
      .filter(e => e.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  isAdmin: boolean = false;

  resetNewEvent() {
    this.newEvent = { title: '', date: '', desc: '', location: '' };
  }

  addToCalendar(ev: EventItem | null) {
    if (!ev) return;
    // Placeholder: integrate with calendar APIs if needed.
    // For now just log — this keeps template typing safe and avoids runtime errors.
    console.log('Add to calendar:', ev);
  }
  title = 'Plateforme Universitaire';
  currentYear = new Date().getFullYear();

  // --- Carousel ---
  carouselImages = ['/assets/images/iset-1.svg', '/assets/images/iset-2.svg', '/assets/images/iset-3.svg'];
  currentSlide = 0;
  private _carouselTimer: any = null;

  // --- Metrics ---
  usersTarget = 12000; users = 0; usersDisplay = '0';
  teachersTarget = 120; teachers = 0;
  studentsTarget = 4200; students = 0;
  specialtiesTarget = 18; specialties = 0;

  // --- Features section ---
  features = [
    { title: 'Gestion des étudiants', desc: 'Inscription, emplois du temps, notes et absences centralisés.' },
    { title: 'Espace enseignants', desc: 'Planification, évaluations et communication simple.' },
    { title: 'Tableau de bord', desc: 'Vue d’ensemble en temps réel pour les admins.' }
  ];

  // --- News ---
  newsItems = [
    { id: 1, title: 'Rentrée Universitaire', body: 'La rentrée commence le 15 septembre.', date: '2025-09-01' },
    { id: 2, title: 'Nouveau laboratoire', body: 'Inauguration d’un nouveau laboratoire de programmation.', date: '2025-07-10' }
  ];
  private _nextNewsId = 3;
  editingIndex: number | null = null;
  editTitle = ''; editBody = '';

  // --- Events (nouvelle fonctionnalité) ---
  events: EventItem[] = [
    { id: 1, title: 'Rentrée générale', date: this.isoForOffsetDays(7), desc: 'Accueil des nouveaux étudiants', location: 'Amphi A' },
    { id: 2, title: 'Conférence IA', date: this.isoForOffsetDays(20), desc: 'Conférence sur l’intelligence artificielle.', location: 'Salle 101' },
    { id: 3, title: 'Hackathon', date: this.isoForOffsetDays(35), desc: '48h de challenges pour étudiants.', location: 'Lab central' }
  ];
  private _nextEventId = 4;

  currentMonth = new Date();
  weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  calendarDays: Array<{ date: Date; otherMonth?: boolean; events?: EventItem[] }> = [];
  monthLabel = '';
  showEventModal = false;
  selectedEvent: EventItem | null = null;
  newEvent: Partial<EventItem> = { title: '', date: '', desc: '', location: '' };

  // --- Contact ---
  contactName = ''; contactEmail = ''; contactPhone = ''; contactMessage = '';
  contactSent = false; private _contactTimer: any = null;

  ngOnInit(): void {
    this.startCarousel();
    this.animateCount('users', this.usersTarget, 1800, true);
    this.animateCount('teachers', this.teachersTarget, 1200);
    this.animateCount('students', this.studentsTarget, 1400);
    this.animateCount('specialties', this.specialtiesTarget, 1000);
    this.updateCalendar();
  }

  ngOnDestroy(): void {
    if (this._carouselTimer) clearInterval(this._carouselTimer);
    if (this._contactTimer) clearTimeout(this._contactTimer);
  }

  // --- Carousel ---
  startCarousel() { this._carouselTimer = setInterval(() => this.nextSlide(), 4500); }
  nextSlide() { this.currentSlide = (this.currentSlide + 1) % this.carouselImages.length; }
  goToSlide(i: number) { this.currentSlide = i; }

  // --- Counters ---
  private animateCount(key: 'users' | 'teachers' | 'students' | 'specialties', target: number, duration = 1200, formatK = false) {
    const start = performance.now();
    const step = (ts: number) => {
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      if (key === 'users') this.usersDisplay = formatK && val >= 1000 ? Math.floor(val / 1000) + 'k+' : val.toString();
      (this as any)[key] = val;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // --- Navigation ---
  getStarted() { window.location.href = '/auth/login'; }
  openDocs() { window.open('https://angular.io', '_blank'); }

  // --- News management ---
  addNews() {
    if (!this.editTitle || !this.editBody) return;
    const item = { id: this._nextNewsId++, title: this.editTitle, body: this.editBody, date: new Date().toISOString().slice(0, 10) };
    this.newsItems.unshift(item);
    this.clearEditor();
  }
  startEdit(i: number) { const it = this.newsItems[i]; if (!it) return; this.editingIndex = i; this.editTitle = it.title; this.editBody = it.body; }
  saveEdit() { if (this.editingIndex == null) return; const it = this.newsItems[this.editingIndex]; it.title = this.editTitle; it.body = this.editBody; this.cancelEdit(); }
  cancelEdit() { this.editingIndex = null; this.clearEditor(); }
  clearEditor() { this.editTitle = ''; this.editBody = ''; }
  removeNews(i: number) { this.newsItems.splice(i, 1); }

  // --- Contact form ---
  sendContact() {
    if (!this.contactName || !this.contactEmail || !this.contactMessage) return;
    this.contactSent = true;
    if (this._contactTimer) clearTimeout(this._contactTimer);
    this._contactTimer = setTimeout(() => this.contactSent = false, 4000);
    this.contactName = this.contactEmail = this.contactPhone = this.contactMessage = '';
  }

  // --- Events / Calendar ---
  isoForOffsetDays(offset: number) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  }

  updateCalendar() {
    const ref = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const month = ref.getMonth(), year = ref.getFullYear();
    this.monthLabel = ref.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    const firstDayWeek = (ref.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ date: Date; otherMonth?: boolean; events?: EventItem[] }> = [];
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLast - i);
      days.push({ date: d, otherMonth: true, events: this.eventsForDate(d) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      days.push({ date: dt, otherMonth: false, events: this.eventsForDate(dt) });
    }
    let nextDay = 1;
    while (days.length % 7 !== 0) {
      const dt = new Date(year, month + 1, nextDay++);
      days.push({ date: dt, otherMonth: true, events: this.eventsForDate(dt) });
    }
    this.calendarDays = days;
  }

  eventsForDate(d: Date) {
    const key = d.toISOString().slice(0, 10);
    return this.events.filter(e => e.date === key);
  }

  openDay(day: { date: Date; events?: EventItem[] }) {
    if (day.events && day.events.length) this.openEventModal(day.events[0]);
  }

  openEventModal(ev: EventItem) { this.selectedEvent = ev; this.showEventModal = true; }
  closeEventModal() { this.showEventModal = false; this.selectedEvent = null; }

  addEvent() {
    if (!this.newEvent.title || !this.newEvent.date) return;
    const ev: EventItem = {
      id: this._nextEventId++,
      title: this.newEvent.title!,
      date: this.newEvent.date!,
      desc: this.newEvent.desc || '',
      location: this.newEvent.location || ''
    };
    this.events.push(ev);
    this.newEvent = { title: '', date: '', desc: '', location: '' };
    this.updateCalendar();
  }

  prevMonth() { this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1); this.updateCalendar(); }
  nextMonth() { this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1); this.updateCalendar(); }

  // ===== Nouvelles méthodes pour les améliorations UI =====
  
  // 4️⃣ Vérifier si une date est aujourd'hui
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  // 4️⃣ Déterminer le type d'événement pour les badges
  getEventType(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('conférence') || lowerTitle.includes('conference')) return 'conference';
    if (lowerTitle.includes('hackathon')) return 'hackathon';
    if (lowerTitle.includes('rentrée') || lowerTitle.includes('rentree')) return 'rentree';
    return 'default';
  }

  // 5️⃣ Déterminer l'icône pour les actualités
  getNewsIcon(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('rentrée') || lowerTitle.includes('rentree')) return 'school';
    if (lowerTitle.includes('laboratoire') || lowerTitle.includes('lab')) return 'science';
    if (lowerTitle.includes('nouveau') || lowerTitle.includes('nouvelle')) return 'fiber_new';
    if (lowerTitle.includes('événement') || lowerTitle.includes('evenement')) return 'event';
    if (lowerTitle.includes('résultat') || lowerTitle.includes('resultat')) return 'assessment';
    return 'announcement';
  }
}
