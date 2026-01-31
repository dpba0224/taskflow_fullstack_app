import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  toggleSidebar = output();
  createTicket = output();
  search = output<string>();

  searchQuery = '';

  constructor(
    private auth: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  onSearch() {
    this.search.emit(this.searchQuery);
    this.router.navigate(['/tickets'], { queryParams: { search: this.searchQuery } });
  }

  onCreateTicket() {
    this.createTicket.emit();
  }

  onToggleTheme() {
    this.themeService.toggle();
    const user = this.auth.user();
    if (user) {
      this.themeService.saveTheme(user.id, this.themeService.isDark() ? 'dark' : 'light').subscribe();
    }
  }

  onLogout() {
    this.auth.logout();
  }
}
