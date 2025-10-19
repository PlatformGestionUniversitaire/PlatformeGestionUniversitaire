import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { studentRoutes } from './student-routing.module';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(studentRoutes)],
  declarations: []
})
export class StudentModule {}
