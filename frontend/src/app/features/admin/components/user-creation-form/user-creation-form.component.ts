import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService, CreateUserRequest } from '../../services/user-management.service';
import { UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-creation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="user-creation-form">
      <h2>Create New User</h2>
      
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <!-- Full Name -->
        <div class="form-group">
          <label for="name">Full Name *</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            placeholder="Enter full name"
            [class.error]="isFieldInvalid('name')"
          />
          <div class="error-message" *ngIf="isFieldInvalid('name')">
            <span *ngIf="userForm.get('name')?.errors?.['required']">Name is required</span>
            <span *ngIf="userForm.get('name')?.errors?.['minlength']">Name must be at least 3 characters</span>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email Address *</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="Enter email address"
            [class.error]="isFieldInvalid('email')"
          />
          <div class="error-message" *ngIf="isFieldInvalid('email')">
            <span *ngIf="userForm.get('email')?.errors?.['required']">Email is required</span>
            <span *ngIf="userForm.get('email')?.errors?.['email']">Please enter a valid email</span>
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password *</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            placeholder="Enter password"
            [class.error]="isFieldInvalid('password')"
          />
          <div class="error-message" *ngIf="isFieldInvalid('password')">
            <span *ngIf="userForm.get('password')?.errors?.['required']">Password is required</span>
            <span *ngIf="userForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
          </div>
        </div>

        <!-- Role Selection - ONLY for Admins -->
        <div class="form-group">
          <label for="role">User Role *</label>
          <select
            id="role"
            formControlName="role"
            [class.error]="isFieldInvalid('role')"
          >
            <option value="">Select a role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Administrator</option>
            <option value="director">Director</option>
          </select>
          <div class="error-message" *ngIf="isFieldInvalid('role')">
            <span *ngIf="userForm.get('role')?.errors?.['required']">Role is required</span>
          </div>
        </div>

        <!-- Role Description -->
        <div class="role-description" *ngIf="userForm.get('role')?.value">
          <strong>{{ getRoleLabel(userForm.get('role')?.value) }}</strong>
          <p>{{ getRoleDescription(userForm.get('role')?.value) }}</p>
        </div>

        <!-- Error Alert -->
        <div class="alert alert-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <!-- Success Alert -->
        <div class="alert alert-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="isLoading || userForm.invalid">
            <span *ngIf="!isLoading">Create User</span>
            <span *ngIf="isLoading">Creating...</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .user-creation-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      margin-bottom: 2rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #555;
    }

    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #4f46e5;
    }

    input.error, select.error {
      border-color: #ef4444;
    }

    .error-message {
      margin-top: 0.5rem;
      color: #ef4444;
      font-size: 0.875rem;
    }

    .role-description {
      padding: 1rem;
      background-color: #f0f9ff;
      border-left: 4px solid #4f46e5;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }

    .role-description strong {
      display: block;
      margin-bottom: 0.5rem;
      color: #1e40af;
    }

    .role-description p {
      margin: 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }

    .alert-error {
      background-color: #fee;
      color: #c00;
      border: 1px solid #fcc;
    }

    .alert-success {
      background-color: #efe;
      color: #080;
      border: 1px solid #cfc;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #4f46e5;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #4338ca;
    }

    .btn-primary:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #e5e7eb;
      color: #374151;
    }

    .btn-secondary:hover {
      background-color: #d1d5db;
    }
  `]
})
export class UserCreationFormComponent implements OnInit {
  @Output() userCreated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  userForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      student: 'Student Account',
      teacher: 'Teacher Account',
      admin: 'Administrator Account',
      director: 'Director Account'
    };
    return labels[role] || '';
  }

  getRoleDescription(role: string): string {
    const descriptions: Record<string, string> = {
      student: 'Can view courses, submit assignments, and access student resources.',
      teacher: 'Can manage courses, grade assignments, and communicate with students.',
      admin: 'Full system access including user management and system configuration.',
      director: 'Can view reports, manage departments, and oversee academic operations.'
    };
    return descriptions[role] || '';
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData: CreateUserRequest = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        role: this.userForm.value.role as UserRole
      };

      this.userManagementService.createUser(userData).subscribe({
        next: (user) => {
          this.successMessage = `User ${user.name} created successfully as ${user.role}`;
          this.isLoading = false;
          this.userForm.reset();
          
          // Émettre l'événement après un délai pour afficher le message
          setTimeout(() => {
            this.userCreated.emit();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to create user. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
