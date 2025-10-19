import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface Absence {
  id: string;
  date: Date;
  course: string;
  status: 'pending' | 'excused' | 'unexcused';
}

@Component({
  selector: 'app-student-absences',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule],
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent {
  absences: Absence[] = [
    { id: 'a1', date: new Date('2025-09-15'), course: 'Programmation Web', status: 'pending' },
    { id: 'a2', date: new Date('2025-09-20'), course: 'Base de Donn\u00e9es', status: 'excused' }
  ];

  requestExcuse(abs: Absence) {
    console.log('Requesting excuse for', abs);
  }
}
