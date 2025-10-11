import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientName?: string;
  subject: string;
  body: string;
  preview: string;
  date: Date;
  read: boolean;
  important: boolean;
  fromMe: boolean;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'teacher' | 'admin';
}

interface RecipientGroup {
  label: string;
  recipients: Recipient[];
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  selectedFolder = 'inbox';
  selectedMessage: Message | null = null;
  showCompose = false;
  composeMode: 'new' | 'reply' | 'forward' = 'new';
  searchQuery = '';
  unreadCount = 8;
  draftsCount = 2;
  isSending = false;
  
  composeForm: FormGroup;
  attachedFiles: File[] = [];

  messages: Message[] = [
    {
      id: '1',
      senderName: 'Ahmed Ben Ali',
      senderEmail: 'ahmed.benali@student.iset.tn',
      subject: 'Demande de rattrapage - Mathématiques',
      body: '<p>Bonjour Professeur,</p><p>Je vous écris pour demander une séance de rattrapage pour le cours de mathématiques appliquées du 8 octobre que j\'ai manqué pour des raisons médicales.</p><p>J\'ai joint mon justificatif médical à ce message. Pourriez-vous me faire savoir quand une séance de rattrapage pourrait être organisée ?</p><p>Cordialement,<br/>Ahmed Ben Ali</p>',
      preview: 'Bonjour Professeur, Je vous écris pour demander une séance de rattrapage...',
      date: new Date('2025-10-10T14:30:00'),
      read: false,
      important: false,
      fromMe: false,
      attachments: [
        { id: '1', name: 'justificatif_medical.pdf', size: 245760, type: 'application/pdf' }
      ]
    },
    {
      id: '2',
      senderName: 'Fatma Gharbi',
      senderEmail: 'fatma.gharbi@student.iset.tn',
      subject: 'Question sur le TP Base de Données',
      body: '<p>Bonjour Professeur,</p><p>J\'ai une question concernant le TP de base de données que nous avons fait hier. Je n\'arrive pas à comprendre la jointure externe dans l\'exercice 3.</p><p>Pourriez-vous m\'expliquer la différence entre LEFT JOIN et RIGHT JOIN avec un exemple concret ?</p><p>Merci d\'avance,<br/>Fatma Gharbi</p>',
      preview: 'Bonjour Professeur, J\'ai une question concernant le TP de base de données...',
      date: new Date('2025-10-09T16:45:00'),
      read: false,
      important: true,
      fromMe: false
    },
    {
      id: '3',
      senderName: 'Mohamed Triki',
      senderEmail: 'mohamed.triki@student.iset.tn',
      subject: 'Remerciements',
      body: '<p>Bonjour Professeur,</p><p>Je voulais vous remercier pour l\'aide que vous m\'avez apportée pendant les heures de bureau. Grâce à vos explications, j\'ai pu mieux comprendre les concepts d\'algorithmique.</p><p>Votre pédagogie et votre patience sont très appréciées.</p><p>Cordialement,<br/>Mohamed Triki</p>',
      preview: 'Bonjour Professeur, Je voulais vous remercier pour l\'aide...',
      date: new Date('2025-10-09T11:20:00'),
      read: true,
      important: false,
      fromMe: false
    },
    {
      id: '4',
      senderName: 'Dr. Samir Khelifi',
      senderEmail: 'samir.khelifi@iset.tn',
      subject: 'Réunion département - Ordre du jour',
      body: '<p>Cher collègue,</p><p>Je vous rappelle la réunion de département prévue vendredi 13 octobre à 14h en salle de conférence.</p><p>Ordre du jour :<br/>- Planning des examens<br/>- Nouveau matériel informatique<br/>- Formation continue</p><p>Cordialement,<br/>Dr. Samir Khelifi</p>',
      preview: 'Cher collègue, Je vous rappelle la réunion de département...',
      date: new Date('2025-10-08T09:15:00'),
      read: true,
      important: true,
      fromMe: false
    }
  ];

  filteredMessages: Message[] = [];

  recipientGroups: RecipientGroup[] = [
    {
      label: 'Mes Étudiants - L2 Info A',
      recipients: [
        { id: '1', name: 'Ahmed Ben Ali', email: 'ahmed.benali@student.iset.tn', type: 'student' },
        { id: '2', name: 'Fatma Gharbi', email: 'fatma.gharbi@student.iset.tn', type: 'student' },
        { id: '3', name: 'Mohamed Triki', email: 'mohamed.triki@student.iset.tn', type: 'student' }
      ]
    },
    {
      label: 'Mes Étudiants - L1 Info B',
      recipients: [
        { id: '4', name: 'Sarra Mansouri', email: 'sarra.mansouri@student.iset.tn', type: 'student' },
        { id: '5', name: 'Karim Boudali', email: 'karim.boudali@student.iset.tn', type: 'student' }
      ]
    },
    {
      label: 'Collègues',
      recipients: [
        { id: '6', name: 'Dr. Samir Khelifi', email: 'samir.khelifi@iset.tn', type: 'teacher' },
        { id: '7', name: 'Prof. Leila Amara', email: 'leila.amara@iset.tn', type: 'teacher' }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.composeForm = this.fb.group({
      recipients: [[], Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.filterMessages();
  }

  selectFolder(folder: string): void {
    this.selectedFolder = folder;
    this.selectedMessage = null;
    this.showCompose = false;
    this.filterMessages();
  }

  selectMessage(message: Message): void {
    this.selectedMessage = message;
    if (!message.read) {
      message.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    }
  }

  goBackToList(): void {
    this.selectedMessage = null;
  }

  composeMessage(): void {
    this.showCompose = true;
    this.composeMode = 'new';
    this.selectedMessage = null;
    this.resetComposeForm();
  }

  replyToMessage(): void {
    if (this.selectedMessage) {
      this.showCompose = true;
      this.composeMode = 'reply';
      this.composeForm.patchValue({
        recipients: [this.selectedMessage.senderEmail],
        subject: 'Re: ' + this.selectedMessage.subject,
        body: '\n\n--- Message original ---\n' + this.selectedMessage.body.replace(/<[^>]*>/g, '')
      });
    }
  }

  forwardMessage(): void {
    if (this.selectedMessage) {
      this.showCompose = true;
      this.composeMode = 'forward';
      this.composeForm.patchValue({
        subject: 'Fwd: ' + this.selectedMessage.subject,
        body: '\n\n--- Message transféré ---\nDe: ' + this.selectedMessage.senderName + '\nSujet: ' + this.selectedMessage.subject + '\n\n' + this.selectedMessage.body.replace(/<[^>]*>/g, '')
      });
    }
  }

  cancelCompose(): void {
    this.showCompose = false;
    this.resetComposeForm();
  }

  sendMessage(): void {
    if (this.composeForm.valid) {
      this.isSending = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Message sent:', this.composeForm.value);
        this.isSending = false;
        this.showCompose = false;
        this.resetComposeForm();
        // Show success message
      }, 2000);
    }
  }

  saveDraft(): void {
    console.log('Save as draft:', this.composeForm.value);
    this.draftsCount++;
    // Save to drafts
  }

  resetComposeForm(): void {
    this.composeForm.reset();
    this.attachedFiles = [];
  }

  filterMessages(): void {
    let filtered = this.messages;
    
    // Filter by folder
    switch (this.selectedFolder) {
      case 'inbox':
        filtered = this.messages.filter(m => !m.fromMe);
        break;
      case 'sent':
        filtered = this.messages.filter(m => m.fromMe);
        break;
      case 'drafts':
        filtered = []; // No drafts in sample data
        break;
      case 'archive':
        filtered = []; // No archived messages in sample data
        break;
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.senderName.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query) ||
        m.preview.toLowerCase().includes(query)
      );
    }

    this.filteredMessages = filtered;
  }

  refreshMessages(): void {
    console.log('Refreshing messages...');
    // Refresh messages from server
  }

  toggleImportant(message: Message, event: Event): void {
    event.stopPropagation();
    message.important = !message.important;
  }

  archiveMessage(message: Message, event: Event): void {
    event.stopPropagation();
    console.log('Archive message:', message.id);
    // Move to archive
  }

  deleteMessage(): void {
    if (this.selectedMessage) {
      console.log('Delete message:', this.selectedMessage.id);
      // Delete message and go back to list
      this.goBackToList();
    }
  }

  onFilesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.attachedFiles.push(...files);
  }

  removeFile(file: File): void {
    const index = this.attachedFiles.indexOf(file);
    if (index > -1) {
      this.attachedFiles.splice(index, 1);
    }
  }

  downloadAttachment(attachment: Attachment): void {
    console.log('Download attachment:', attachment.name);
    // Download file
  }

  getFolderTitle(): string {
    const titles: { [key: string]: string } = {
      inbox: 'Boîte de Réception',
      sent: 'Messages Envoyés',
      drafts: 'Brouillons',
      archive: 'Messages Archivés'
    };
    return titles[this.selectedFolder] || 'Messages';
  }

  getNoMessagesIcon(): string {
    const icons: { [key: string]: string } = {
      inbox: 'inbox',
      sent: 'send',
      drafts: 'drafts',
      archive: 'archive'
    };
    return icons[this.selectedFolder] || 'mail';
  }

  getNoMessagesText(): string {
    const texts: { [key: string]: string } = {
      inbox: 'Aucun message reçu',
      sent: 'Aucun message envoyé',
      drafts: 'Aucun brouillon',
      archive: 'Aucun message archivé'
    };
    return texts[this.selectedFolder] || 'Aucun message';
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  }
}
