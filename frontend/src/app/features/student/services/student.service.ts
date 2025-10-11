import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, delay } from 'rxjs';
import {
  StudentProfile,
  StudentTimetable,
  StudentAbsence,
  AbsenceExcuse,
  StudentGrade,
  StudentStatistics,
  StudentNotification,
  StudentDashboardData
} from '../models/student.models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private notificationsSubject = new BehaviorSubject<StudentNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  // Profile Management
  getProfile(): Observable<StudentProfile> {
    const mockProfile: StudentProfile = {
      id: '1',
      studentId: '2021001',
      firstName: 'Ahmed',
      lastName: 'Ben Ali',
      email: 'ahmed.benali@iset-tozeur.tn',
      program: 'Informatique',
      year: 2,
      semester: 4,
      enrollmentDate: new Date('2021-09-01')
    };
    return of(mockProfile).pipe(delay(500));
  }

  updateProfile(profile: Partial<StudentProfile>): Observable<StudentProfile> {
    const updatedProfile: StudentProfile = {
      id: '1',
      studentId: '2021001',
      firstName: profile.firstName || 'Ahmed',
      lastName: profile.lastName || 'Ben Ali',
      email: profile.email || 'ahmed.benali@iset-tozeur.tn',
      program: profile.program || 'Informatique',
      year: profile.year || 2,
      semester: profile.semester || 4,
      enrollmentDate: profile.enrollmentDate || new Date('2021-09-01')
    };
    return of(updatedProfile).pipe(delay(500));
  }

  // Timetable Management
  getTimetable(week?: string): Observable<StudentTimetable[]> {
    const mockTimetable: StudentTimetable[] = [
      {
        id: '1',
        courseId: 'INF201',
        courseName: 'Programmation Web',
        teacherName: 'Prof. Amira Salhi',
        dayOfWeek: 'Lundi',
        startTime: '08:30',
        endTime: '10:00',
        classroom: 'B101',
        courseType: 'cours'
      },
      {
        id: '2',
        courseId: 'INF202',
        courseName: 'Base de Données',
        teacherName: 'Prof. Karim Mejri',
        dayOfWeek: 'Lundi',
        startTime: '10:15',
        endTime: '11:45',
        classroom: 'B102',
        courseType: 'td'
      },
      {
        id: '3',
        courseId: 'INF203',
        courseName: 'Algorithmique',
        teacherName: 'Prof. Fatma Bouzid',
        dayOfWeek: 'Mardi',
        startTime: '09:00',
        endTime: '10:30',
        classroom: 'A203',
        courseType: 'cours'
      }
    ];
    return of(mockTimetable).pipe(delay(500));
  }

  getWeeklyTimetable(startDate: Date): Observable<StudentTimetable[]> {
    return this.getTimetable();
  }

  // Absences Management
  getAbsences(filters?: any): Observable<StudentAbsence[]> {
    const mockAbsences: StudentAbsence[] = [
      {
        id: '1',
        courseId: 'INF201',
        courseName: 'Programmation Web',
        date: new Date('2024-10-15'),
        startTime: '08:30',
        endTime: '10:00',
        teacherName: 'Prof. Amira Salhi',
        isJustified: false,
        createdAt: new Date('2024-10-15')
      },
      {
        id: '2',
        courseId: 'INF202',
        courseName: 'Base de Données',
        date: new Date('2024-10-12'),
        startTime: '10:15',
        endTime: '11:45',
        teacherName: 'Prof. Karim Mejri',
        isJustified: true,
        justificationDocument: 'certificat_medical.pdf',
        createdAt: new Date('2024-10-12')
      }
    ];
    return of(mockAbsences).pipe(delay(500));
  }

  submitExcuse(absenceId: string, excuse: { reason: string; document?: File }): Observable<AbsenceExcuse> {
    const mockExcuse: AbsenceExcuse = {
      id: Date.now().toString(),
      absenceId,
      reason: excuse.reason,
      submittedAt: new Date(),
      status: 'pending'
    };
    return of(mockExcuse).pipe(delay(500));
  }

  getExcuses(): Observable<AbsenceExcuse[]> {
    const mockExcuses: AbsenceExcuse[] = [
      {
        id: '1',
        absenceId: '1',
        reason: 'Maladie - certificat médical fourni',
        submittedAt: new Date('2024-10-15'),
        status: 'pending'
      }
    ];
    return of(mockExcuses).pipe(delay(500));
  }

  // Grades Management
  getGrades(filters?: any): Observable<StudentGrade[]> {
    const mockGrades: StudentGrade[] = [
      {
        id: '1',
        courseId: 'INF201',
        courseName: 'Programmation Web',
        examType: 'ds',
        grade: 15,
        maxGrade: 20,
        coefficient: 2,
        date: new Date('2024-10-10'),
        semester: 4,
        teacherName: 'Prof. Amira Salhi'
      },
      {
        id: '2',
        courseId: 'INF202',
        courseName: 'Base de Données',
        examType: 'tp',
        grade: 17,
        maxGrade: 20,
        coefficient: 1,
        date: new Date('2024-10-08'),
        semester: 4,
        teacherName: 'Prof. Karim Mejri'
      },
      {
        id: '3',
        courseId: 'INF203',
        courseName: 'Algorithmique',
        examType: 'exam',
        grade: 13,
        maxGrade: 20,
        coefficient: 3,
        date: new Date('2024-10-05'),
        semester: 4,
        teacherName: 'Prof. Fatma Bouzid'
      }
    ];
    return of(mockGrades).pipe(delay(500));
  }

  getGradesByCourse(courseId: string): Observable<StudentGrade[]> {
    return this.getGrades({ courseId });
  }

  // Statistics
  getStatistics(): Observable<StudentStatistics> {
    const mockStats: StudentStatistics = {
      overallGPA: 14.5,
      semesterGPA: 15.2,
      totalAbsences: 3,
      justifiedAbsences: 1,
      unjustifiedAbsences: 2,
      absenteeismRate: 5.2,
      isAtRiskOfElimination: false,
      gradesBySubject: {
        'Programmation Web': {
          average: 15,
          grades: [],
          coefficient: 2
        },
        'Base de Données': {
          average: 17,
          grades: [],
          coefficient: 2
        }
      },
      attendanceBySubject: {
        'Programmation Web': {
          totalSessions: 20,
          attendedSessions: 19,
          absences: 1,
          attendanceRate: 95
        }
      }
    };
    return of(mockStats).pipe(delay(500));
  }

  // Notifications Management
  getNotifications(): Observable<StudentNotification[]> {
    const mockNotifications: StudentNotification[] = [
      {
        id: '1',
        type: 'timetable_change',
        title: 'Changement d\'emploi du temps',
        message: 'Le cours de Programmation Web du 15/10 a été déplacé en salle C101',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000),
        priority: 'medium'
      },
      {
        id: '2',
        type: 'grade_published',
        title: 'Nouvelle note disponible',
        message: 'Votre note de TP Base de Données a été publiée: 17/20',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000),
        priority: 'low'
      },
      {
        id: '3',
        type: 'absence_recorded',
        title: 'Absence enregistrée',
        message: 'Une absence a été enregistrée pour le cours de Programmation Web du 15/10',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000),
        priority: 'high'
      }
    ];
    return of(mockNotifications).pipe(delay(500));
  }

  markNotificationAsRead(notificationId: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  markAllNotificationsAsRead(): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  deleteNotification(notificationId: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  // Dashboard Data
  getDashboardData(): Observable<StudentDashboardData> {
    const mockDashboard: StudentDashboardData = {
      profile: {
        id: '1',
        studentId: '2021001',
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        email: 'ahmed.benali@iset-tozeur.tn',
        program: 'Informatique',
        year: 2,
        semester: 4,
        enrollmentDate: new Date('2021-09-01')
      },
      upcomingClasses: [
        {
          id: '1',
          courseId: 'INF201',
          courseName: 'Programmation Web',
          teacherName: 'Prof. Amira Salhi',
          dayOfWeek: 'Demain',
          startTime: '08:30',
          endTime: '10:00',
          classroom: 'B101',
          courseType: 'cours'
        }
      ],
      recentGrades: [
        {
          id: '2',
          courseId: 'INF202',
          courseName: 'Base de Données',
          examType: 'tp',
          grade: 17,
          maxGrade: 20,
          coefficient: 1,
          date: new Date('2024-10-08'),
          semester: 4,
          teacherName: 'Prof. Karim Mejri'
        }
      ],
      unreadNotifications: [],
      weeklyTimetable: [
        {
          id: '1',
          courseId: 'INF201',
          courseName: 'Programmation Web',
          teacherName: 'Prof. Amira Salhi',
          dayOfWeek: 'Lundi',
          startTime: '08:30',
          endTime: '10:00',
          classroom: 'B101',
          courseType: 'cours'
        },
        {
          id: '2',
          courseId: 'INF202',
          courseName: 'Base de Données',
          teacherName: 'Prof. Karim Mejri',
          dayOfWeek: 'Lundi',
          startTime: '10:15',
          endTime: '11:45',
          classroom: 'B102',
          courseType: 'td'
        },
        {
          id: '3',
          courseId: 'INF203',
          courseName: 'Algorithmique',
          teacherName: 'Prof. Fatma Bouzid',
          dayOfWeek: 'Mardi',
          startTime: '09:00',
          endTime: '10:30',
          classroom: 'A203',
          courseType: 'cours'
        },
        {
          id: '4',
          courseId: 'INF204',
          courseName: 'Réseaux',
          teacherName: 'Prof. Omar Triki',
          dayOfWeek: 'Mardi',
          startTime: '14:00',
          endTime: '15:30',
          classroom: 'C105',
          courseType: 'tp'
        },
        {
          id: '5',
          courseId: 'INF205',
          courseName: 'Système d\'Exploitation',
          teacherName: 'Prof. Leila Gharbi',
          dayOfWeek: 'Mercredi',
          startTime: '08:30',
          endTime: '10:00',
          classroom: 'A201',
          courseType: 'cours'
        },
        {
          id: '6',
          courseId: 'INF206',
          courseName: 'Anglais Technique',
          teacherName: 'Prof. Sarah Johnson',
          dayOfWeek: 'Jeudi',
          startTime: '10:15',
          endTime: '11:45',
          classroom: 'B203',
          courseType: 'cours'
        },
        {
          id: '7',
          courseId: 'INF201',
          courseName: 'Programmation Web',
          teacherName: 'Prof. Amira Salhi',
          dayOfWeek: 'Vendredi',
          startTime: '08:30',
          endTime: '10:00',
          classroom: 'Lab1',
          courseType: 'tp',
          isModified: true
        }
      ],
      statistics: {
        overallGPA: 14.5,
        semesterGPA: 15.2,
        totalAbsences: 3,
        justifiedAbsences: 1,
        unjustifiedAbsences: 2,
        absenteeismRate: 5.2,
        isAtRiskOfElimination: false,
        gradesBySubject: {},
        attendanceBySubject: {}
      },
      pendingExcuses: [
        {
          id: '1',
          absenceId: '1',
          reason: 'Maladie - certificat médical fourni',
          submittedAt: new Date('2024-10-15'),
          status: 'pending'
        }
      ]
    };
    return of(mockDashboard).pipe(delay(500));
  }

  // Utility Methods
  private loadNotifications(): void {
    this.getNotifications().subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  refreshNotifications(): void {
    this.loadNotifications();
  }

  getUnreadNotificationsCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        observer.next(unreadCount);
      });
    });
  }

  // Real-time updates simulation
  simulateRealTimeUpdates(): void {
    setInterval(() => {
      this.loadNotifications();
    }, 30000);
  }

  // Absence Excuses
  getAbsenceExcuses(): Observable<AbsenceExcuse[]> {
    const mockExcuses: AbsenceExcuse[] = [
      {
        id: '1',
        absenceId: '1',
        reason: 'Maladie - Consultation médicale urgente',
        submittedAt: new Date('2024-01-15'),
        status: 'approved',
        reviewDate: new Date('2024-01-16'),
        reviewComment: 'Excuse acceptée avec certificat médical valide',
        reviewedBy: 'Prof. Martin'
      },
      {
        id: '2', 
        absenceId: '3',
        reason: 'Problème de transport - Grève des transports publics',
        submittedAt: new Date('2024-01-22'),
        status: 'pending'
      }
    ];
    
    return of(mockExcuses).pipe(delay(500));
  }

  submitAbsenceExcuse(excuse: Partial<AbsenceExcuse>): Observable<AbsenceExcuse> {
    const newExcuse: AbsenceExcuse = {
      id: Math.random().toString(36),
      submittedAt: new Date(),
      status: 'pending',
      ...excuse as Omit<AbsenceExcuse, 'id' | 'submittedAt' | 'status'>
    };

    return of(newExcuse).pipe(delay(1000));
  }

  // Demandes d'excuse pour absence
  submitExcuseRequest(excuseData: any): Observable<AbsenceExcuse> {
    const newExcuse: AbsenceExcuse = {
      id: Math.random().toString(36),
      absenceId: Math.random().toString(36),
      reason: excuseData.reason,
      submittedAt: new Date(),
      status: 'pending'
    };

    return of(newExcuse).pipe(delay(1000));
  }

  // Demandes de rattrapage
  submitMakeupRequest(makeupData: any): Observable<any> {
    const makeupRequest = {
      id: Math.random().toString(36),
      courseId: makeupData.courseId,
      courseName: makeupData.courseName,
      teacherId: makeupData.teacherId,
      preferredDate: makeupData.preferredDate,
      preferredTime: makeupData.preferredTime,
      reason: makeupData.reason,
      status: 'pending',
      submittedAt: new Date()
    };

    return of(makeupRequest).pipe(delay(1000));
  }

  // Obtenir la liste des enseignants pour un cours
  getTeachersForCourse(courseId: string): Observable<any[]> {
    const mockTeachers = [
      { id: 'teacher1', name: 'Prof. Amira Salhi', email: 'amira.salhi@iset.tn' },
      { id: 'teacher2', name: 'Prof. Karim Mejri', email: 'karim.mejri@iset.tn' },
      { id: 'teacher3', name: 'Prof. Fatma Bouzid', email: 'fatma.bouzid@iset.tn' }
    ];
    return of(mockTeachers).pipe(delay(500));
  }

  // Obtenir la liste des directeurs
  getDirectors(): Observable<any[]> {
    const mockDirectors = [
      { id: 'director1', name: 'Dr. Mohamed Trabelsi', email: 'mohamed.trabelsi@iset.tn' },
      { id: 'director2', name: 'Dr. Salma Khouja', email: 'salma.khouja@iset.tn' }
    ];
    return of(mockDirectors).pipe(delay(500));
  }
}