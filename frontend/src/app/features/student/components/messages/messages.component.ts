import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface Message {
  id: string;
  sender: string;
  subject: string;
  date: Date;
  read: boolean;
}

@Component({
  selector: 'app-student-messages',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages: Message[] = [
    { id: 'm1', sender: 'Administration', subject: 'Changement d\'horaire', date: new Date('2025-10-12'), read: false },
    { id: 'm2', sender: 'Dr. Sami', subject: 'Rappel TD', date: new Date('2025-10-10'), read: true }
  ];

  openMessage(m: Message) {
    console.log('Open message', m);
    m.read = true;
  }
}
