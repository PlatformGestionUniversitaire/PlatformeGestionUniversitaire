import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  async list(resource: string): Promise<any[]> {
    // simple mock for events to keep UI functional during dev
    if (resource === 'events') {
      return Promise.resolve([
        { id: '1', title: 'Rentrée universitaire', date: '2025-09-01' },
        { id: '2', title: 'Journée portes ouvertes', date: '2025-11-15' }
      ]);
    }
    try {
      return await lastValueFrom(this.http.get<any[]>(`${this.apiUrl}/${resource}`));
    } catch (e) {
      return [];
    }
  }

  async get(resource: string, id: string): Promise<any | null> {
    try {
      return await lastValueFrom(this.http.get<any>(`${this.apiUrl}/${resource}/${id}`));
    } catch (e) {
      return null;
    }
  }

  async create(resource: string, payload: any): Promise<any | null> {
    if (resource === 'events') return Promise.resolve({ id: Date.now().toString(), ...payload });
    try {
      return await lastValueFrom(this.http.post<any>(`${this.apiUrl}/${resource}`, payload));
    } catch (e) {
      return null;
    }
  }

  async update(resource: string, id: string, payload: any): Promise<any | null> {
    try {
      return await lastValueFrom(this.http.put<any>(`${this.apiUrl}/${resource}/${id}`, payload));
    } catch (e) {
      return null;
    }
  }

  // Accept undefined id to match component usage where id may be optional
  async remove(resource: string, id?: string): Promise<void> {
    if (!id) return;
    if (resource === 'events') return Promise.resolve();
    try {
      await lastValueFrom(this.http.delete<void>(`${this.apiUrl}/${resource}/${id}`));
    } catch (e) {
      // swallow errors for now (UI uses optimistic UX)
    }
  }
}
