import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentStatsComponent } from '../../components/department-stats/department-stats.component';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, DepartmentStatsComponent],
  template: '<app-department-stats></app-department-stats>'
})
export class StatsPageComponent {}