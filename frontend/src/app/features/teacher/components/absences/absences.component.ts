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

interface Course {
  id: string;
  subject: string;
  group: string;
  time: string;
}

interface Absence {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  course: string;
  reason: string;
  comment?: string;
  status: 'pending' | 'approved' | 'rejected';
  hasJustification?: boolean;
}

interface StudentAbsence extends Absence {
  studentName: string;
}

@Component({
  selector: 'app-absences',
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
    MatChipsModule
  ],
  templateUrl: './absences.component.html',
  styleUrl: './absences.component.css'
})
export class AbsencesComponent implements OnInit {
  selectedTab = 0;
  absenceForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;
  selectedPeriod = 'month';
  selectedCourseFilter = '';

  myCourses: Course[] = [
    {
      id: '1',
      subject: 'Mathématiques Appliquées',
      group: 'L2 Info A',
      time: '08:30 - 10:00'
    },
    {
      id: '2',
      subject: 'Algorithmique',
      group: 'L1 Info B',
      time: '10:15 - 11:45'
    },
    {
      id: '3',
      subject: 'Base de Données',
      group: 'L2 Info A',
      time: '14:00 - 15:30'
    },
    {
      id: '4',
      subject: 'Programmation Web',
      group: 'L3 Info',
      time: '15:45 - 17:15'
    }
  ];

  myAbsences: Absence[] = [
    {
      id: '1',
      date: new Date('2025-10-08'),
      startTime: '08:30',
      endTime: '10:00',
      course: 'Mathématiques Appliquées - L2 Info A',
      reason: 'medical',
      comment: 'Consultation médicale urgente',
      status: 'approved',
      hasJustification: true
    },
    {
      id: '2',
      date: new Date('2025-10-10'),
      startTime: '14:00',
      endTime: '15:30',
      course: 'Base de Données - L2 Info A',
      reason: 'transport',
      comment: 'Panne de voiture',
      status: 'pending'
    }
  ];

  pendingStudentAbsences: StudentAbsence[] = [
    {
      id: '1',
      studentName: 'Ahmed Ben Ali',
      date: new Date('2025-10-09'),
      startTime: '08:30',
      endTime: '10:00',
      course: 'Mathématiques Appliquées - L2 Info A',
      reason: 'medical',
      comment: 'Rendez-vous médical',
      status: 'pending',
      hasJustification: true
    },
    {
      id: '2',
      studentName: 'Fatma Gharbi',
      date: new Date('2025-10-10'),
      startTime: '10:15',
      endTime: '11:45',
      course: 'Algorithmique - L1 Info B',
      reason: 'family',
      comment: 'Événement familial important',
      status: 'pending',
      hasJustification: false
    },
    {
      id: '3',
      studentName: 'Mohamed Triki',
      date: new Date('2025-10-11'),
      startTime: '14:00',
      endTime: '15:30',
      course: 'Base de Données - L2 Info A',
      reason: 'transport',
      status: 'pending'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.absenceForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      courseId: ['', Validators.required],
      reason: ['', Validators.required],
      comment: ['']
    });
  }

  ngOnInit(): void {
    // Load initial data
  }

  onTabChange(event: any): void {
    this.selectedTab = event.index;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitAbsence(): void {
    if (this.absenceForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Absence submitted:', this.absenceForm.value);
        this.isSubmitting = false;
        this.resetForm();
        // Show success message
      }, 2000);
    }
  }

  resetForm(): void {
    this.absenceForm.reset();
    this.selectedFile = null;
  }

  filterMyAbsences(): void {
    // Filter absences based on selected period
    console.log('Filter my absences by period:', this.selectedPeriod);
  }

  filterStudentAbsences(): void {
    // Filter student absences based on selected course
    console.log('Filter student absences by course:', this.selectedCourseFilter);
  }

  cancelAbsence(absenceId: string): void {
    console.log('Cancel absence:', absenceId);
    // Remove from myAbsences array or update status
  }

  approveAbsence(absenceId: string): void {
    console.log('Approve absence:', absenceId);
    // Update absence status to approved
  }

  rejectAbsence(absenceId: string): void {
    console.log('Reject absence:', absenceId);
    // Update absence status to rejected
  }

  viewJustification(absenceId: string): void {
    console.log('View justification for absence:', absenceId);
    // Open justification document
  }

  getReasonLabel(reason: string): string {
    const reasons: { [key: string]: string } = {
      medical: 'Raison médicale',
      family: 'Raison familiale',
      professional: 'Raison professionnelle',
      transport: 'Problème de transport',
      other: 'Autre'
    };
    return reasons[reason] || reason;
  }

  getStatusLabel(status: string): string {
    const statuses: { [key: string]: string } = {
      pending: 'En attente',
      approved: 'Approuvée',
      rejected: 'Refusée'
    };
    return statuses[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'accent',
      approved: 'primary',
      rejected: 'warn'
    };
    return colors[status] || 'accent';
  }
}
