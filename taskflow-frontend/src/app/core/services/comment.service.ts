import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Comment } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getComments(ticketId: string) {
    return this.http.get<ApiResponse<Comment[]>>(`${this.api}/tickets/${ticketId}/comments`).pipe(map(r => r.data));
  }

  addComment(ticketId: string, content: string) {
    return this.http.post<ApiResponse<Comment>>(`${this.api}/tickets/${ticketId}/comments`, { content }).pipe(map(r => r.data));
  }

  updateComment(commentId: string, content: string) {
    return this.http.put<ApiResponse<Comment>>(`${this.api}/comments/${commentId}`, { content }).pipe(map(r => r.data));
  }

  deleteComment(commentId: string) {
    return this.http.delete<ApiResponse<void>>(`${this.api}/comments/${commentId}`);
  }
}
