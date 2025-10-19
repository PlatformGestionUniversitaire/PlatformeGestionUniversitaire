import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface AdminEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private apiUrl = '/api/admin/events';

  constructor(private http: HttpClient) {}

  listEvents(): Observable<AdminEvent[]> {
    const mock: AdminEvent[] = [
      { id: '1', title: 'Rentrée universitaire', date: '2025-09-01', location: 'Amphi A' },
      { id: '2', title: 'Journée portes ouvertes', date: '2025-11-15', location: 'Campus' }
    ];
    return of(mock);
    // return this.http.get<AdminEvent[]>(this.apiUrl);
  }

  getEvent(id: string): Observable<AdminEvent> {
    return of({ id, title: 'Événement', date: new Date().toISOString(), location: 'N/A' });
    // return this.http.get<AdminEvent>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: Partial<AdminEvent>): Observable<AdminEvent> {
    const created: AdminEvent = { id: Date.now().toString(), title: event.title || 'Nouvel événement', date: event.date || new Date().toISOString(), location: event.location };
    return of(created);
    // return this.http.post<AdminEvent>(this.apiUrl, event);
  }

  updateEvent(id: string, event: Partial<AdminEvent>): Observable<AdminEvent> {
    return of({ id, title: event.title || 'Événement modifié', date: event.date || new Date().toISOString(), location: event.location });
    // return this.http.put<AdminEvent>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return of(void 0);
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
