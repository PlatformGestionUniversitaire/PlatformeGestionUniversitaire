import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface Notification {
  id: string;
  title: string;
  body: string;
  date: Date;
  read: boolean;
}

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notifications: Notification[] = [
    { id: 'n1', title: 'Annulation', body: 'Cours de Base de Donn\u00e9es annul\u00e9 samedi', date: new Date('2025-10-10'), read: false }
  ];

  markRead(n: Notification) { n.read = true; }
}
