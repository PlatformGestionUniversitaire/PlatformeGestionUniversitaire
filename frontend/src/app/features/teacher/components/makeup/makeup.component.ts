import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface Course {
  id: string;
  subject: string;
  group: string;
}

interface Room {
  id: string;
  number: string;
  capacity: number;
  type: string;
}

interface Makeup {
  id: string;
  subject: string;
  group: string;
  date: Date;
  startTime: string;
  endTime: string;
  room: string;
  type: 'lecture' | 'td' | 'tp';
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  attendanceCount?: number;
  expectedCount?: number;
}

interface StudentRequest {
  id: string;
  studentName: string;
  course: string;
  requestDate: Date;
  missedDate: Date;
  reason: string;
  preferredDates?: string[];
}

@Component({
  selector: 'app-makeup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  templateUrl: './makeup.component.html',
  styleUrl: './makeup.component.css'
})
export class MakeupComponent implements OnInit {
  selectedTab = 0;
  makeupForm: FormGroup;
  isSubmitting = false;
  selectedPeriod = 'upcoming';

  myCourses: Course[] = [
    {
      id: '1',
      subject: 'Mathématiques Appliquées',
      group: 'L2 Info A'
    },
    {
      id: '2',
      subject: 'Algorithmique',
      group: 'L1 Info B'
    },
    {
      id: '3',
      subject: 'Base de Données',
      group: 'L2 Info A'
    },
    {
      id: '4',
      subject: 'Programmation Web',
      group: 'L3 Info'
    }
  ];

  availableRooms: Room[] = [
    { id: '1', number: '101', capacity: 40, type: 'Amphithéâtre' },
    { id: '2', number: '205', capacity: 30, type: 'Salle de TD' },
    { id: '3', number: '103', capacity: 25, type: 'Labo Informatique' },
    { id: '4', number: '201', capacity: 35, type: 'Salle de cours' }
  ];

  myMakeups: Makeup[] = [
    {
      id: '1',
      subject: 'Mathématiques Appliquées',
      group: 'L2 Info A',
      date: new Date('2025-10-19'),
      startTime: '14:00',
      endTime: '15:30',
      room: '101',
      type: 'lecture',
      reason: 'Rattrapage cours annulé pour absence médicale',
      status: 'scheduled'
    },
    {
      id: '2',
      subject: 'Base de Données',
      group: 'L2 Info A',
      date: new Date('2025-10-05'),
      startTime: '10:15',
      endTime: '11:45',
      room: '103',
      type: 'tp',
      reason: 'Rattrapage TP annulé pour panne technique',
      status: 'completed',
      attendanceCount: 28,
      expectedCount: 32
    }
  ];

  studentRequests: StudentRequest[] = [
    {
      id: '1',
      studentName: 'Ahmed Ben Ali',
      course: 'Mathématiques Appliquées - L2 Info A',
      requestDate: new Date('2025-10-10'),
      missedDate: new Date('2025-10-08'),
      reason: 'Absence médicale justifiée',
      preferredDates: ['15/10/2025', '18/10/2025']
    },
    {
      id: '2',
      studentName: 'Fatma Gharbi',
      course: 'Algorithmique - L1 Info B',
      requestDate: new Date('2025-10-11'),
      missedDate: new Date('2025-10-09'),
      reason: 'Problème de transport',
      preferredDates: ['16/10/2025']
    }
  ];

  constructor(private fb: FormBuilder) {
    this.makeupForm = this.fb.group({
      courseId: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      room: ['', Validators.required],
      type: ['', Validators.required],
      reason: ['', Validators.required],
      description: [''],
      notifyStudents: [true]
    });
  }

  ngOnInit(): void {
    // Load initial data
  }

  submitMakeup(): void {
    if (this.makeupForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Makeup session created:', this.makeupForm.value);
        this.isSubmitting = false;
        this.resetMakeupForm();
        // Show success message and redirect to "Mes Rattrapages" tab
        this.selectedTab = 1;
      }, 2000);
    }
  }

  resetMakeupForm(): void {
    this.makeupForm.reset();
    this.makeupForm.patchValue({ notifyStudents: true });
  }

  filterMakeups(): void {
    console.log('Filter makeups by period:', this.selectedPeriod);
    // Filter logic here
  }

  viewMakeupDetails(makeupId: string): void {
    console.log('View makeup details:', makeupId);
    // Navigate to details page or open modal
  }

  editMakeup(makeupId: string): void {
    console.log('Edit makeup:', makeupId);
    // Load makeup data into form and switch to creation tab
  }

  cancelMakeup(makeupId: string): void {
    console.log('Cancel makeup:', makeupId);
    // Update status to cancelled
  }

  viewAttendance(makeupId: string): void {
    console.log('View attendance for makeup:', makeupId);
    // Navigate to attendance page
  }

  acceptRequest(requestId: string): void {
    console.log('Accept student request:', requestId);
    // Remove from requests and potentially create a makeup session
  }

  rejectRequest(requestId: string): void {
    console.log('Reject student request:', requestId);
    // Update request status to rejected
  }

  getTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      lecture: 'Cours Magistral',
      td: 'Travaux Dirigés',
      tp: 'Travaux Pratiques'
    };
    return types[type] || type;
  }

  getStatusLabel(status: string): string {
    const statuses: { [key: string]: string } = {
      scheduled: 'Programmé',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };
    return statuses[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      scheduled: 'accent',
      completed: 'primary',
      cancelled: 'warn'
    };
    return colors[status] || 'accent';
  }
}
