import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  email = '';
  name = '';
  message = '';
  sent = false;

  send() {
    if (!this.email || !this.name || !this.message) return;
    this.sent = true;
    setTimeout(() => this.sent = false, 4000);
    this.email = this.name = this.message = '';
  }
}
