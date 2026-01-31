import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './theme.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class KeyboardService {
  private createTicketCallback: (() => void) | null = null;
  private waitingForG = false;

  constructor(
    private router: Router,
    private theme: ThemeService,
    private auth: AuthService,
    private zone: NgZone
  ) {}

  registerCreateTicket(callback: () => void) {
    this.createTicketCallback = callback;
  }

  init() {
    document.addEventListener('keydown', (e) => this.handleKey(e));
  }

  private handleKey(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;

    // Cmd/Ctrl+K — focus search (works even in inputs)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.zone.run(() => {
        const searchInput = document.querySelector<HTMLInputElement>('app-header input[type="text"]');
        searchInput?.focus();
      });
      return;
    }

    // Don't handle other shortcuts if user is typing
    if (isInput) {
      this.waitingForG = false;
      return;
    }

    // G then ... navigation chords
    if (this.waitingForG) {
      this.waitingForG = false;
      e.preventDefault();
      this.zone.run(() => {
        switch (e.key.toLowerCase()) {
          case 'd': this.router.navigate(['/tickets']); break;
          case 'b': this.router.navigate(['/board']); break;
          case 'r': this.router.navigate(['/reports']); break;
          case 'p': this.router.navigate(['/profile']); break;
        }
      });
      return;
    }

    if (e.key === 'g') {
      this.waitingForG = true;
      setTimeout(() => this.waitingForG = false, 800);
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'c':
        e.preventDefault();
        this.zone.run(() => this.createTicketCallback?.());
        break;
      case 't':
        e.preventDefault();
        this.zone.run(() => {
          this.theme.toggle();
          const user = this.auth.user();
          if (user) {
            this.theme.saveTheme(user.id, this.theme.isDark() ? 'dark' : 'light').subscribe();
          }
        });
        break;
      case 'escape':
        // Let components handle Escape themselves
        break;
    }
  }
}
