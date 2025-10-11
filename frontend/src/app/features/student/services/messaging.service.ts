import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  InternalMessage,
  MessageThread,
  CreateMessageRequest,
  MessageParticipant
} from '../models/student.models';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor() {}

  // Messages Management
  getMessages(threadId?: string): Observable<InternalMessage[]> {
    const mockMessages: InternalMessage[] = [
      {
        id: '1',
        senderId: 'teacher_1',
        senderName: 'Prof. Amira Salhi',
        senderRole: 'enseignant',
        recipientId: '1',
        recipientName: 'Ahmed Ben Ali',
        subject: 'Rattrapage TP Programmation Web',
        content: 'Bonjour Ahmed, vous pouvez rattraper votre TP manqué demain à 14h en salle B101.',
        sentAt: new Date(Date.now() - 3600000),
        isRead: false,
        threadId: 'thread_1'
      },
      {
        id: '2',
        senderId: 'admin_1',
        senderName: 'Administration',
        senderRole: 'administration',
        recipientId: '1',
        recipientName: 'Ahmed Ben Ali',
        subject: 'Rappel: Inscription aux examens',
        content: 'N\'oubliez pas de vous inscrire aux examens avant le 20 octobre.',
        sentAt: new Date(Date.now() - 86400000),
        isRead: true,
        threadId: 'thread_2'
      }
    ];
    return of(mockMessages).pipe(delay(500));
  }

  getMessageThreads(): Observable<MessageThread[]> {
    const mockThreads: MessageThread[] = [
      {
        id: 'thread_1',
        subject: 'Rattrapage TP Programmation Web',
        participants: [
          {
            id: 'teacher_1',
            name: 'Prof. Amira Salhi',
            role: 'enseignant',
            email: 'amira.salhi@iset-tozeur.tn'
          },
          {
            id: '1',
            name: 'Ahmed Ben Ali',
            role: 'étudiant',
            email: 'ahmed.benali@iset-tozeur.tn'
          }
        ],
        lastMessage: {
          id: '1',
          senderId: 'teacher_1',
          senderName: 'Prof. Amira Salhi',
          senderRole: 'enseignant',
          recipientId: '1',
          recipientName: 'Ahmed Ben Ali',
          subject: 'Rattrapage TP Programmation Web',
          content: 'Bonjour Ahmed, vous pouvez rattraper votre TP manqué demain à 14h en salle B101.',
          sentAt: new Date(Date.now() - 3600000),
          isRead: false,
          threadId: 'thread_1'
        },
        messagesCount: 1,
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000)
      }
    ];
    return of(mockThreads).pipe(delay(500));
  }

  sendMessage(messageRequest: CreateMessageRequest): Observable<InternalMessage> {
    const newMessage: InternalMessage = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'Ahmed Ben Ali',
      senderRole: 'étudiant',
      recipientId: messageRequest.recipientId,
      recipientName: 'Destinataire',
      subject: messageRequest.subject,
      content: messageRequest.content,
      sentAt: new Date(),
      isRead: false,
      threadId: messageRequest.parentMessageId ? 'thread_1' : undefined
    };
    return of(newMessage).pipe(delay(800));
  }

  markMessageAsRead(messageId: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  deleteMessage(messageId: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  // Contacts Management
  getContacts(): Observable<MessageParticipant[]> {
    const mockContacts: MessageParticipant[] = [
      {
        id: 'teacher_1',
        name: 'Prof. Amira Salhi',
        role: 'enseignant',
        email: 'amira.salhi@iset-tozeur.tn'
      },
      {
        id: 'teacher_2',
        name: 'Prof. Karim Mejri',
        role: 'enseignant',
        email: 'karim.mejri@iset-tozeur.tn'
      },
      {
        id: 'admin_1',
        name: 'Administration',
        role: 'administration',
        email: 'admin@iset-tozeur.tn'
      }
    ];
    return of(mockContacts).pipe(delay(500));
  }

  searchContacts(query: string): Observable<MessageParticipant[]> {
    return this.getContacts();
  }

  // Utility Methods
  getUnreadMessagesCount(): Observable<number> {
    return new Observable(observer => {
      this.getMessages().subscribe(messages => {
        const unreadCount = messages.filter(m => !m.isRead).length;
        observer.next(unreadCount);
      });
    });
  }

  getMessagesInThread(threadId: string): Observable<InternalMessage[]> {
    // Mock messages for a specific thread
    const mockMessages: InternalMessage[] = [
      {
        id: '1',
        senderId: 'teacher_1',
        senderName: 'Prof. Amira Salhi',
        senderRole: 'enseignant',
        recipientId: 'student_1',
        recipientName: 'Étudiant Actuel',
        subject: 'Résultats du contrôle',
        content: 'Bonjour, je vous informe que les résultats du contrôle de programmation web sont disponibles. Vous avez obtenu une note de 16/20. Félicitations !',
        sentAt: new Date('2024-01-20T10:30:00'),
        isRead: true,
        threadId: threadId,
        attachments: []
      },
      {
        id: '2',
        senderId: 'student_1',
        senderName: 'Étudiant Actuel',
        senderRole: 'étudiant',
        recipientId: 'teacher_1',
        recipientName: 'Prof. Amira Salhi',
        subject: 'Re: Résultats du contrôle',
        content: 'Merci beaucoup professeur pour ces bonnes nouvelles ! J\'aimerais savoir s\'il est possible de consulter ma copie pour voir mes erreurs.',
        sentAt: new Date('2024-01-20T14:15:00'),
        isRead: true,
        threadId: threadId,
        attachments: []
      }
    ];

    return of(mockMessages).pipe(delay(300));
  }

  markThreadAsRead(threadId: string): Observable<void> {
    // Mock implementation - mark all messages in thread as read
    return of(void 0).pipe(delay(100));
  }
}