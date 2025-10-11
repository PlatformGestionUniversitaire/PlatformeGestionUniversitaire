import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { StudentTimetable } from '../../models/student.models';

@Component({
  selector: 'student-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  timetable: StudentTimetable[] = [];
  weeklyTimetable: { [day: string]: StudentTimetable[] } = {};
  loading = true;
  error: string | null = null;
  
  // Configuration
  weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots = [
    '08:30-10:00', '10:15-11:45', '12:00-13:30', 
    '14:00-15:30', '15:45-17:15', '17:30-19:00'
  ];
  
  // Current week
  currentWeekStart = new Date();
  
  constructor(private studentService: StudentService) {
    this.setCurrentWeek();
  }

  ngOnInit(): void {
    this.loadTimetable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTimetable(): void {
    this.loading = true;
    this.error = null;

    this.studentService.getWeeklyTimetable(this.currentWeekStart)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (timetable) => {
          this.timetable = timetable;
          this.organizeByDay();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l\'emploi du temps:', error);
          this.error = 'Erreur lors du chargement de l\'emploi du temps';
          this.loading = false;
        }
      });
  }

  private organizeByDay(): void {
    this.weeklyTimetable = {};
    
    // Initialiser tous les jours
    this.weekDays.forEach(day => {
      this.weeklyTimetable[day] = [];
    });
    
    // Organiser les cours par jour
    this.timetable.forEach(course => {
      if (this.weeklyTimetable[course.dayOfWeek]) {
        this.weeklyTimetable[course.dayOfWeek].push(course);
      }
    });
    
    // Trier par heure de début
    Object.keys(this.weeklyTimetable).forEach(day => {
      this.weeklyTimetable[day].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      );
    });
  }

  private setCurrentWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    this.currentWeekStart = new Date(today.setDate(diff));
  }

  // Navigation
  previousWeek(): void {
    this.currentWeekStart = new Date(
      this.currentWeekStart.getTime() - (7 * 24 * 60 * 60 * 1000)
    );
    this.loadTimetable();
  }

  nextWeek(): void {
    this.currentWeekStart = new Date(
      this.currentWeekStart.getTime() + (7 * 24 * 60 * 60 * 1000)
    );
    this.loadTimetable();
  }

  currentWeek(): void {
    this.setCurrentWeek();
    this.loadTimetable();
  }

  // Utility methods
  getWeekDateRange(): string {
    const endDate = new Date(this.currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    
    return `${this.formatDate(this.currentWeekStart)} - ${this.formatDate(endDate)}`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getCourseTypeClass(type: string): string {
    switch (type) {
      case 'cours':
        return 'course-type-cours';
      case 'td':
        return 'course-type-td';
      case 'tp':
        return 'course-type-tp';
      default:
        return 'course-type-default';
    }
  }

  getCourseStatusClass(course: StudentTimetable): string {
    if (course.isCancelled) return 'course-cancelled';
    if (course.isModified) return 'course-modified';
    return '';
  }

  hasCoursesForDay(day: string): boolean {
    return this.weeklyTimetable[day] && this.weeklyTimetable[day].length > 0;
  }

  getTotalHoursPerDay(day: string): number {
    if (!this.weeklyTimetable[day]) return 0;
    
    return this.weeklyTimetable[day].reduce((total, course) => {
      const start = this.parseTime(course.startTime);
      const end = this.parseTime(course.endTime);
      return total + (end - start) / (1000 * 60 * 60);
    }, 0);
  }

  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes).getTime();
  }

  refresh(): void {
    this.loadTimetable();
  }

  onCourseClick(course: StudentTimetable): void {
    // Afficher les détails du cours
    // Ouvrir la modale de justificatif pour ce cours
    this.selectedCourse = course;
    this.studentName = '';
  this.motif = 'Motif médical';
  this.absenceDate = this.formatDateForInput(this.getDateForDay(course.dayOfWeek));
    this.showExcuseModal = true;
    // For debugging
    console.log('Course clicked:', course);
  }

  // Modal / excuse state
  selectedCourse: StudentTimetable | null = null;
  showExcuseModal = false;
  studentName = '';
  absenceDate = '';
  motif = '';

  formatDateForInput(date: Date): string {
    // returns YYYY-MM-DD
    try {
      return date.toISOString().slice(0, 10);
    } catch {
      return '';
    }
  }

  getDateForDay(dayName: string): Date {
    const dayIndex = this.weekDays.indexOf(dayName); // 0-based
    if (dayIndex === -1) return new Date();

    const d = new Date(this.currentWeekStart);
    d.setDate(d.getDate() + dayIndex);
    return d;
  }

  generateExcuseText(): string {
    if (!this.selectedCourse) return '';

    const course = this.selectedCourse;
    const dateStr = this.absenceDate || this.formatDate(this.getDateForDay(course.dayOfWeek));
    const student = this.studentName || 'Nom Prénom';
    const motif = this.motif || 'Motif: ...';

    return `Objet: Justificatif d'absence\n\nJe soussigné(e) ${student},\ncertifie mon absence le ${dateStr} pour le cours "${course.courseName}" animé par ${course.teacherName} de ${course.startTime} à ${course.endTime} (salle: ${course.classroom}).\n\nMotif : ${motif}.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${student}`;
  }

  closeModal(): void {
    this.showExcuseModal = false;
    this.selectedCourse = null;
  }

  copyExcuseToClipboard(): void {
    const text = this.generateExcuseText();
    if (!text) return;

    if (navigator && (navigator as any).clipboard && (navigator as any).clipboard.writeText) {
      (navigator as any).clipboard.writeText(text).then(() => {
        // Optionally notify user
        console.log('Justificatif copié dans le presse-papiers');
      }).catch((err: unknown) => console.error('Erreur copie:', err));
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        console.log('Justificatif copié (fallback)');
      } catch (err) {
        console.error('Impossible de copier', err);
      }
      document.body.removeChild(textarea);
    }
  }

  downloadExcuseAsTxt(): void {
    const text = this.generateExcuseText();
    if (!text) return;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = `justificatif_${this.selectedCourse?.courseName.replace(/\s+/g, '_') || 'absence'}.txt`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  hasModifiedCourses(): boolean {
    return this.timetable.some(course => course.isModified || course.isCancelled);
  }

  getModifiedCoursesCount(): number {
    return this.timetable.filter(course => course.isModified || course.isCancelled).length;
  }
}
