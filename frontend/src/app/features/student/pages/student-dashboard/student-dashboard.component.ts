import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { MessagingService } from '../../services/messaging.service';
import {
  StudentDashboardData,
  StudentTimetable,
  StudentGrade,
  StudentNotification,
  StudentStatistics,
  AbsenceExcuse,
  CreateMessageRequest
} from '../../models/student.models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  dashboardData: StudentDashboardData | null = null;
  loading = true;
  error: string | null = null;
  
  // Stats pour les cartes du dashboard
  unreadNotificationsCount = 0;
  unreadMessagesCount = 0;
  upcomingClassesCount = 0;
  
  // Modals et interactions
  showTimetableModal = false;
  showExcuseModal = false;
  showMakeupModal = false;
  showMessageModal = false;
  selectedTimetableSlot: StudentTimetable | null = null;
  selectedDay = '';
  
  // Formulaires
  excuseForm = {
    reason: '',
    document: null as File | null
  };
  
  makeupForm = {
    preferredDate: '',
    preferredTime: '',
    reason: ''
  };
  
  messageForm = {
    recipientId: '',
    recipientType: 'teacher' as 'teacher' | 'director',
    subject: '',
    content: ''
  };
  
  // Emploi du temps par jour
  weeklyTimetable: { [key: string]: StudentTimetable[] } = {};
  weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots = ['08:30', '10:00', '11:30', '14:00', '15:30', '17:00'];
  
  constructor(
    private studentService: StudentService,
    private messagingService: MessagingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedDay = this.weekDays[0]; // Initialiser avec le premier jour
    this.loadDashboardData();
    this.loadNotificationCounts();
    this.setupRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.studentService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.upcomingClassesCount = data.upcomingClasses.length;
          this.organizeWeeklyTimetable(data.weeklyTimetable);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement du dashboard:', error);
          this.error = 'Erreur lors du chargement des données';
          this.loading = false;
        }
      });
  }
  
  private organizeWeeklyTimetable(timetable: StudentTimetable[]): void {
    this.weeklyTimetable = {};
    this.weekDays.forEach(day => {
      this.weeklyTimetable[day] = timetable.filter(slot => slot.dayOfWeek === day);
    });
  }

  private loadNotificationCounts(): void {
    // Compter les notifications non lues
    this.studentService.getUnreadNotificationsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadNotificationsCount = count;
      });

    // Compter les messages non lus
    this.messagingService.getUnreadMessagesCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadMessagesCount = count;
      });
  }

  private setupRealTimeUpdates(): void {
    // Simuler des mises à jour en temps réel
    this.studentService.simulateRealTimeUpdates();
  }

  // Navigation methods
  navigateToTimetable(): void {
    this.router.navigate(['/student/timetable']);
  }

  navigateToGrades(): void {
    this.router.navigate(['/student/grades']);
  }

  navigateToAbsences(): void {
    this.router.navigate(['/student/absences']);
  }

  navigateToMessages(): void {
    this.router.navigate(['/student/messages']);
  }

  navigateToNotifications(): void {
    this.router.navigate(['/student/notifications']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/student/statistics']);
  }

  // Utility methods
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'timetable_change':
        return '📅';
      case 'course_cancellation':
        return '❌';
      case 'absence_recorded':
        return '📝';
      case 'grade_published':
        return '📊';
      case 'elimination_warning':
        return '⚠️';
      case 'message_received':
        return '✉️';
      default:
        return '🔔';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time;
  }

  getGPAColor(gpa: number): string {
    if (gpa >= 16) return 'text-green-600';
    if (gpa >= 12) return 'text-yellow-600';
    return 'text-red-600';
  }

  getAttendanceColor(rate: number): string {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  }

  refreshDashboard(): void {
    this.loadDashboardData();
    this.loadNotificationCounts();
  }

  onNotificationClick(notification: StudentNotification): void {
    // Marquer comme lue
    this.studentService.markNotificationAsRead(notification.id).subscribe();
    
    // Naviguer selon le type
    switch (notification.type) {
      case 'timetable_change':
        this.navigateToTimetable();
        break;
      case 'grade_published':
        this.navigateToGrades();
        break;
      case 'absence_recorded':
        this.navigateToAbsences();
        break;
      default:
        this.navigateToNotifications();
    }
  }

  // Gestion de l'emploi du temps
  openTimetableModal(): void {
    this.selectedDay = this.weekDays[0];
    this.showTimetableModal = true;
  }

  closeTimetableModal(): void {
    this.showTimetableModal = false;
    this.selectedTimetableSlot = null;
  }

  onTimetableSlotClick(slot: StudentTimetable): void {
    this.selectedTimetableSlot = slot;
  }

  getTimetableForDay(day: string): StudentTimetable[] {
    return this.weeklyTimetable[day] || [];
  }

  getSlotClass(slot: StudentTimetable): string {
    let classes = 'timetable-slot';
    if (slot.isCancelled) classes += ' cancelled';
    if (slot.isModified) classes += ' modified';
    if (this.selectedTimetableSlot?.id === slot.id) classes += ' selected';
    return classes;
  }

  // Gestion des demandes d'excuse
  openExcuseModal(): void {
    if (!this.selectedTimetableSlot) return;
    this.showExcuseModal = true;
    this.excuseForm = {
      reason: '',
      document: null
    };
  }

  closeExcuseModal(): void {
    this.showExcuseModal = false;
    this.excuseForm = {
      reason: '',
      document: null
    };
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.excuseForm.document = file;
    }
  }

  submitExcuse(): void {
    if (!this.selectedTimetableSlot || !this.excuseForm.reason.trim()) return;

    const excuseData = {
      courseId: this.selectedTimetableSlot.courseId,
      courseName: this.selectedTimetableSlot.courseName,
      date: new Date(),
      reason: this.excuseForm.reason,
      document: this.excuseForm.document
    };

    this.studentService.submitExcuseRequest(excuseData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeExcuseModal();
          this.refreshDashboardData();
          // Afficher un message de succès
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'envoi de l\'excuse:', error);
        }
      });
  }

  // Gestion des demandes de rattrapage
  openMakeupModal(): void {
    if (!this.selectedTimetableSlot) return;
    this.showMakeupModal = true;
    this.makeupForm = {
      preferredDate: '',
      preferredTime: '',
      reason: ''
    };
  }

  closeMakeupModal(): void {
    this.showMakeupModal = false;
    this.makeupForm = {
      preferredDate: '',
      preferredTime: '',
      reason: ''
    };
  }

  submitMakeupRequest(): void {
    if (!this.selectedTimetableSlot || !this.makeupForm.reason.trim()) return;

    const makeupData = {
      courseId: this.selectedTimetableSlot.courseId,
      courseName: this.selectedTimetableSlot.courseName,
      teacherId: this.selectedTimetableSlot.teacherName, // À adapter selon votre modèle
      preferredDate: this.makeupForm.preferredDate,
      preferredTime: this.makeupForm.preferredTime,
      reason: this.makeupForm.reason
    };

    this.studentService.submitMakeupRequest(makeupData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeMakeupModal();
          this.refreshDashboardData();
          // Afficher un message de succès
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'envoi de la demande de rattrapage:', error);
        }
      });
  }

  // Gestion des messages
  openMessageModal(type: 'teacher' | 'director'): void {
    this.messageForm.recipientType = type;
    this.showMessageModal = true;
    this.messageForm = {
      recipientId: '',
      recipientType: type,
      subject: this.selectedTimetableSlot ? `Concernant: ${this.selectedTimetableSlot.courseName}` : '',
      content: ''
    };
  }

  closeMessageModal(): void {
    this.showMessageModal = false;
    this.messageForm = {
      recipientId: '',
      recipientType: 'teacher',
      subject: '',
      content: ''
    };
  }

  sendMessage(): void {
    if (!this.messageForm.subject.trim() || !this.messageForm.content.trim()) return;

    const messageData: CreateMessageRequest = {
      recipientId: this.messageForm.recipientId || 'default-recipient', // À gérer selon votre logique
      subject: this.messageForm.subject,
      content: this.messageForm.content
    };

    this.messagingService.sendMessage(messageData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeMessageModal();
          this.refreshDashboardData();
          // Afficher un message de succès
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi du message:', error);
        }
      });
  }

  // Méthodes utilitaires
  refreshDashboardData(): void {
    this.loadDashboardData();
    this.loadNotificationCounts();
  }

  isSlotInPast(slot: StudentTimetable): boolean {
    const now = new Date();
    const slotDate = new Date();
    // Logique pour vérifier si le créneau est passé
    return false; // À implémenter selon votre logique de date
  }

  canSelectSlot(slot: StudentTimetable): boolean {
    return !slot.isCancelled && !this.isSlotInPast(slot);
  }
}
