import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagingService } from '../../services/messaging.service';
import { InternalMessage, MessageThread, MessageParticipant, CreateMessageRequest } from '../../models/student.models';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  threads: MessageThread[] = [];
  messages: InternalMessage[] = [];
  contacts: MessageParticipant[] = [];
  selectedThread: MessageThread | null = null;
  showNewMessageModal = false;
  showContactsModal = false;
  newMessageForm: FormGroup;
  replyForm: FormGroup;
  searchQuery = '';
  loading = false;
  sendingMessage = false;
  currentView: 'threads' | 'messages' = 'threads';

  constructor(
    private messagingService: MessagingService,
    private fb: FormBuilder
  ) {
    this.newMessageForm = this.fb.group({
      recipientId: ['', Validators.required],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.loadThreads();
    this.loadContacts();
  }

  loadThreads() {
    this.loading = true;
    this.messagingService.getMessageThreads().subscribe({
      next: (threads) => {
        this.threads = threads;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading threads:', error);
        this.loading = false;
      }
    });
  }

  loadContacts() {
    this.messagingService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
      }
    });
  }

  loadMessages(threadId: string) {
    this.loading = true;
    this.messagingService.getMessagesInThread(threadId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
        this.currentView = 'messages';
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.loading = false;
      }
    });
  }

  selectThread(thread: MessageThread) {
    this.selectedThread = thread;
    this.loadMessages(thread.id);
    // Mark thread as read
    this.messagingService.markThreadAsRead(thread.id).subscribe();
  }

  backToThreads() {
    this.currentView = 'threads';
    this.selectedThread = null;
    this.messages = [];
  }

  openNewMessageModal() {
    this.showNewMessageModal = true;
    this.newMessageForm.reset();
  }

  closeNewMessageModal() {
    this.showNewMessageModal = false;
    this.newMessageForm.reset();
  }

  openContactsModal() {
    this.showContactsModal = true;
  }

  closeContactsModal() {
    this.showContactsModal = false;
  }

  selectRecipient(contact: MessageParticipant) {
    this.newMessageForm.patchValue({ recipientId: contact.id });
    this.closeContactsModal();
  }

  getSelectedRecipientName(): string {
    const recipientId = this.newMessageForm.get('recipientId')?.value;
    const contact = this.contacts.find(c => c.id === recipientId);
    return contact ? contact.name : 'Sélectionner un destinataire';
  }

  sendNewMessage() {
    if (this.newMessageForm.valid) {
      this.sendingMessage = true;
      
      const messageRequest: CreateMessageRequest = {
        recipientId: this.newMessageForm.value.recipientId,
        subject: this.newMessageForm.value.subject,
        content: this.newMessageForm.value.content
      };

      this.messagingService.sendMessage(messageRequest).subscribe({
        next: (message) => {
          this.loadThreads(); // Refresh threads
          this.closeNewMessageModal();
          this.sendingMessage = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.sendingMessage = false;
        }
      });
    }
  }

  sendReply() {
    if (this.replyForm.valid && this.selectedThread) {
      this.sendingMessage = true;

      const messageRequest: CreateMessageRequest = {
        recipientId: this.getOtherParticipant().id,
        subject: 'Re: ' + this.selectedThread.subject,
        content: this.replyForm.value.content,
        parentMessageId: this.messages[this.messages.length - 1]?.id
      };

      this.messagingService.sendMessage(messageRequest).subscribe({
        next: (message) => {
          this.messages.push(message);
          this.replyForm.reset();
          this.sendingMessage = false;
        },
        error: (error) => {
          console.error('Error sending reply:', error);
          this.sendingMessage = false;
        }
      });
    }
  }

  getOtherParticipant(): MessageParticipant {
    // Return the participant who is not the current user
    return this.selectedThread!.participants.find(p => p.role !== 'student') || this.selectedThread!.participants[0];
  }

  getUnreadThreadsCount(): number {
    return this.threads.filter(thread => !thread.lastMessage.isRead).length;
  }

  getFilteredThreads(): MessageThread[] {
    if (!this.searchQuery.trim()) {
      return this.threads;
    }
    
    return this.threads.filter(thread =>
      thread.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      thread.participants.some(p => p.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  formatMessageTime(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return messageDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  }

  getParticipantNames(participants: MessageParticipant[]): string {
    return participants
      .filter(p => p.role !== 'student')
      .map(p => p.name)
      .join(', ') || 'Vous';
  }

  isMessageFromCurrentUser(message: InternalMessage): boolean {
    return message.senderId === 'current-student-id'; // This should be replaced with actual current user ID
  }
}
