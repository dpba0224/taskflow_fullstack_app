import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly api = environment.apiUrl;
  readonly isDark = signal(false);

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      this.setDark(true);
    }
  }

  toggle() {
    this.setDark(!this.isDark());
  }

  setDark(dark: boolean) {
    this.isDark.set(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
  }

  saveTheme(userId: string, theme: string) {
    return this.http.put<ApiResponse<User>>(`${this.api}/users/${userId}/theme`, { theme });
  }
}
