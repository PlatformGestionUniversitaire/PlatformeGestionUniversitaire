import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { StudentGrade, StudentStatistics } from '../../models/student.models';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  grades: StudentGrade[] = [];
  statistics: StudentStatistics | null = null;
  filteredGrades: StudentGrade[] = [];
  selectedSemester: number | 'all' = 'all';
  selectedCourse: string = 'all';
  semesters: number[] = [];
  courses: string[] = [];
  loading = false;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadGrades();
    this.loadStatistics();
  }

  loadGrades() {
    this.loading = true;
    this.studentService.getGrades().subscribe({
      next: (grades) => {
        this.grades = grades;
        this.filteredGrades = grades;
        this.extractFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading grades:', error);
        this.loading = false;
      }
    });
  }

  loadStatistics() {
    this.studentService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  extractFilters() {
    // Extract unique semesters
    this.semesters = [...new Set(this.grades.map(grade => grade.semester))];
    
    // Extract unique courses
    this.courses = [...new Set(this.grades.map(grade => grade.courseName))];
  }

  applyFilters() {
    this.filteredGrades = this.grades.filter(grade => {
      const semesterMatch = this.selectedSemester === 'all' || grade.semester === this.selectedSemester;
      const courseMatch = this.selectedCourse === 'all' || grade.courseName === this.selectedCourse;
      return semesterMatch && courseMatch;
    });
  }

  onSemesterChange() {
    this.applyFilters();
  }

  onCourseChange() {
    this.applyFilters();
  }

  getGradeClass(grade: number): string {
    if (grade >= 16) return 'excellent';
    if (grade >= 14) return 'very-good';
    if (grade >= 12) return 'good';
    if (grade >= 10) return 'satisfactory';
    return 'needs-improvement';
  }

  getGradeTypeDisplay(type: 'ds' | 'exam' | 'tp' | 'project'): string {
    const types: { [key: string]: string } = {
      'ds': 'Contrôle',
      'exam': 'Examen',
      'tp': 'TP',
      'project': 'Projet'
    };
    return types[type] || type;
  }

  calculateSemesterAverage(semester: number): number {
    const semesterGrades = this.grades.filter(grade => grade.semester === semester);
    if (semesterGrades.length === 0) return 0;
    
    const sum = semesterGrades.reduce((acc, grade) => acc + grade.grade, 0);
    return Math.round((sum / semesterGrades.length) * 100) / 100;
  }

  getSemesterStats() {
    const stats: { [key: number]: { average: number, count: number, passed: number } } = {};
    
    this.semesters.forEach(semester => {
      const semesterGrades = this.grades.filter(grade => grade.semester === semester);
      const sum = semesterGrades.reduce((acc, grade) => acc + grade.grade, 0);
      const average = semesterGrades.length > 0 ? sum / semesterGrades.length : 0;
      const passed = semesterGrades.filter(grade => grade.grade >= 10).length;
      
      stats[semester] = {
        average: Math.round(average * 100) / 100,
        count: semesterGrades.length,
        passed
      };
    });
    
    return stats;
  }

  getSubjectCount(): number {
    return this.statistics ? Object.keys(this.statistics.gradesBySubject).length : 0;
  }
}
