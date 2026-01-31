import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiUrl;
  private readonly currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUser());

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  register(req: RegisterRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/register`, req).pipe(
      tap(res => this.handleAuth(res.data))
    );
  }

  login(req: LoginRequest) {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.api}/auth/login`, req).pipe(
      tap(res => this.handleAuth(res.data))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  refreshCurrentUser() {
    return this.http.get<ApiResponse<User>>(`${this.api}/auth/me`).pipe(
      tap(res => {
        this.currentUser.set(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
    );
  }

  updateProfile(data: { firstName?: string; lastName?: string; avatar?: string }) {
    return this.http.put<ApiResponse<User>>(`${this.api}/auth/profile`, data).pipe(
      tap(res => {
        this.currentUser.set(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put<ApiResponse<void>>(`${this.api}/auth/password`, { currentPassword, newPassword });
  }

  private handleAuth(data: AuthResponse) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }
}
