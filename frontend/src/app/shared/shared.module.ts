// Shared module - export commonly used components/directives/pipes
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
			imports: [
				CommonModule, 
				FooterComponent,
				HasRoleDirective,
				DateFormatPipe
			],
			exports: [
				FooterComponent,
				HasRoleDirective,
				DateFormatPipe
			]
})
export class SharedModule {}
