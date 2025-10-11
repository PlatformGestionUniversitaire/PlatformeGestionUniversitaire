import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferentialsComponent } from '../../components/referentials/referentials.component';

@Component({
  selector: 'app-referentials-page',
  standalone: true,
  imports: [CommonModule, ReferentialsComponent],
  template: '<app-referentials></app-referentials>'
})
export class ReferentialsPageComponent {}