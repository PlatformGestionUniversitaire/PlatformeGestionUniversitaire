import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { StudentAbsence, AbsenceExcuse } from '../../models/student.models';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent implements OnInit {
  absences: StudentAbsence[] = [];
  filteredAbsences: StudentAbsence[] = [];
  excuses: AbsenceExcuse[] = [];
  selectedFilter: string = 'all';
  selectedAbsence: StudentAbsence | null = null;
  showExcuseModal = false;
  excuseForm: FormGroup;
  loading = false;
  submittingExcuse = false;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {
    this.excuseForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]],
      document: [null]
    });
  }

  ngOnInit() {
    this.loadAbsences();
    this.loadExcuses();
  }

  loadAbsences() {
    this.loading = true;
    this.studentService.getAbsences().subscribe({
      next: (absences) => {
        this.absences = absences;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading absences:', error);
        this.loading = false;
      }
    });
  }

  loadExcuses() {
    this.studentService.getAbsenceExcuses().subscribe({
      next: (excuses) => {
        this.excuses = excuses;
      },
      error: (error) => {
        console.error('Error loading excuses:', error);
      }
    });
  }

  applyFilter() {
    switch (this.selectedFilter) {
      case 'justified':
        this.filteredAbsences = this.absences.filter(abs => abs.isJustified);
        break;
      case 'unjustified':
        this.filteredAbsences = this.absences.filter(abs => !abs.isJustified);
        break;
      case 'pending':
        this.filteredAbsences = this.absences.filter(abs => 
          this.excuses.some(excuse => excuse.absenceId === abs.id && excuse.status === 'pending')
        );
        break;
      default:
        this.filteredAbsences = this.absences;
    }
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    this.applyFilter();
  }



  getAbsenceStats() {
    const total = this.absences.length;
    const justified = this.absences.filter(abs => abs.isJustified).length;
    const unjustified = total - justified;
    const pending = this.excuses.filter(excuse => excuse.status === 'pending').length;

    return { total, justified, unjustified, pending };
  }

  canRequestExcuse(absence: StudentAbsence): boolean {
    // Can't request excuse if already justified
    if (absence.isJustified) return false;
    
    // Can't request excuse if there's already a pending or approved excuse
    const existingExcuse = this.excuses.find(excuse => 
      excuse.absenceId === absence.id && 
      (excuse.status === 'pending' || excuse.status === 'approved')
    );
    
    return !existingExcuse;
  }

  getExcuseForAbsence(absenceId: string): AbsenceExcuse | undefined {
    return this.excuses.find(excuse => excuse.absenceId === absenceId);
  }

  openExcuseModal(absence: StudentAbsence) {
    this.selectedAbsence = absence;
    this.showExcuseModal = true;
    this.excuseForm.reset();
  }

  closeExcuseModal() {
    this.showExcuseModal = false;
    this.selectedAbsence = null;
    this.excuseForm.reset();
  }

  submitExcuse() {
    if (this.excuseForm.valid && this.selectedAbsence) {
      this.submittingExcuse = true;

      const excuseRequest: Partial<AbsenceExcuse> = {
        absenceId: this.selectedAbsence.id,
        reason: this.excuseForm.value.reason,
        document: this.excuseForm.value.document
      };

      this.studentService.submitAbsenceExcuse(excuseRequest).subscribe({
        next: (excuse) => {
          this.excuses.push(excuse);
          this.applyFilter();
          this.closeExcuseModal();
          this.submittingExcuse = false;
        },
        error: (error) => {
          console.error('Error submitting excuse:', error);
          this.submittingExcuse = false;
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      default: return '';
    }
  }

  getStatusDisplay(status: string): string {
    const statuses: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Approuvée',
      'rejected': 'Rejetée'
    };
    return statuses[status] || status;
  }
}
