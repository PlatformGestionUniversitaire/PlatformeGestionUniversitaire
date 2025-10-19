import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface AdminReport {
  id: string;
  title: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private apiUrl = '/api/admin/reports';

  constructor(private http: HttpClient) {}

  listReports(): Observable<AdminReport[]> {
    const mock: AdminReport[] = [
      { id: 'r1', title: 'Rapport des absences', createdAt: new Date().toISOString(), status: 'completed' },
      { id: 'r2', title: 'Rapport de fréquentation', createdAt: new Date().toISOString(), status: 'pending' }
    ];
    return of(mock);
    // return this.http.get<AdminReport[]>(this.apiUrl);
  }

  generateReport(payload: { type: string; params?: any }): Observable<AdminReport> {
    const report: AdminReport = { id: Date.now().toString(), title: `Rapport ${payload.type}`, createdAt: new Date().toISOString(), status: 'pending' };
    return of(report);
    // return this.http.post<AdminReport>(this.apiUrl, payload);
  }

  getReport(id: string): Observable<AdminReport> {
    return of({ id, title: 'Rapport', createdAt: new Date().toISOString(), status: 'completed', data: {} });
    // return this.http.get<AdminReport>(`${this.apiUrl}/${id}`);
  }
}
