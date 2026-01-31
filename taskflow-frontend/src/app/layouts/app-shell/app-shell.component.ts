import { Component, OnInit, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TicketCreateComponent } from '../../features/tickets/ticket-create/ticket-create.component';
import { KeyboardService } from '../../core/services/keyboard.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, TicketCreateComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css'
})
export class AppShellComponent implements OnInit {
  sidebarOpen = signal(true);
  showCreateModal = signal(false);
  isMobile = signal(false);

  constructor(private keyboard: KeyboardService) {}

  ngOnInit() {
    this.keyboard.init();
    this.keyboard.registerCreateTicket(() => this.showCreateModal.set(true));
    this.checkMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.showCreateModal()) {
      this.showCreateModal.set(false);
    }
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  private checkMobile() {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (mobile) {
      this.sidebarOpen.set(false);
    }
  }
}
