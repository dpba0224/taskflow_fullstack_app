import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface StandupReport {
  date: string;
  markdown: string;
  stats: {
    completedYesterday: number;
    inProgressToday: number;
    blocked: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly api = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getStandupReport() {
    return this.http.get<ApiResponse<StandupReport>>(`${this.api}/standup`).pipe(map(r => r.data));
  }
}
