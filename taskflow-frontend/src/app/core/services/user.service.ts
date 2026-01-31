import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<ApiResponse<User[]>>(this.api).pipe(map(r => r.data));
  }

  getUserById(id: string) {
    return this.http.get<ApiResponse<User>>(`${this.api}/${id}`).pipe(map(r => r.data));
  }
}
