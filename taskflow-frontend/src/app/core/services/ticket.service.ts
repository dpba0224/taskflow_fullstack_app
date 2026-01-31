import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Ticket, TicketPage, TicketRequest } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly api = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  getTickets(filters: {
    status?: string;
    type?: string;
    priority?: string;
    assignee?: string;
    reporter?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  } = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, String(val));
      }
    });
    return this.http.get<ApiResponse<TicketPage>>(this.api, { params }).pipe(map(r => r.data));
  }

  getTicketById(id: string) {
    return this.http.get<ApiResponse<Ticket>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }

  createTicket(req: TicketRequest) {
    return this.http.post<ApiResponse<Ticket>>(this.api, req).pipe(map(r => r.data));
  }

  updateTicket(id: string, req: Partial<TicketRequest>) {
    return this.http.put<ApiResponse<Ticket>>(`${this.api}/${id}`, req).pipe(map(r => r.data));
  }

  deleteTicket(id: string) {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`);
  }

  getMyTickets(page = 0, limit = 20) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ApiResponse<TicketPage>>(`${this.api}/my`, { params }).pipe(map(r => r.data));
  }

  getReportedTickets(page = 0, limit = 20) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ApiResponse<TicketPage>>(`${this.api}/reported`, { params }).pipe(map(r => r.data));
  }
}
