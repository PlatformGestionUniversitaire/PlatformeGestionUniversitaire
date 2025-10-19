import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Grade {
  subject: string;
  coefficient: number;
  grade: number;
}

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent {
  grades: Grade[] = [
    { subject: 'Programmation Web', coefficient: 3, grade: 14.5 },
    { subject: 'Base de Donn\u00e9es', coefficient: 2, grade: 12 }
  ];

  getAverage(): number {
    const totalWeight = this.grades.reduce((s, g) => s + g.coefficient, 0);
    const weighted = this.grades.reduce((s, g) => s + g.grade * g.coefficient, 0);
    return Math.round((weighted / totalWeight) * 100) / 100;
  }
}
