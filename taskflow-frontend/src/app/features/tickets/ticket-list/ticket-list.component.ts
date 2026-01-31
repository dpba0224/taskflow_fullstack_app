import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket, TICKET_STATUSES, TICKET_TYPES, TICKET_PRIORITIES, STATUS_LABELS, TYPE_LABELS, PRIORITY_LABELS, TicketStatus, TicketType, TicketPriority } from '../../../core/models/ticket.model';
import { TicketCardComponent } from '../../../shared/components/ticket-card/ticket-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-ticket-list',
  imports: [CommonModule, FormsModule, TicketCardComponent, LoaderComponent],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  loading = signal(true);
  total = signal(0);
  totalPages = signal(0);
  page = signal(0);

  statuses = TICKET_STATUSES;
  types = TICKET_TYPES;
  priorities = TICKET_PRIORITIES;

  statusFilter = '';
  typeFilter = '';
  priorityFilter = '';
  searchQuery = '';

  constructor(private ticketService: TicketService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.loadTickets();
    });
  }

  loadTickets() {
    this.loading.set(true);
    this.ticketService.getTickets({
      status: this.statusFilter || undefined,
      type: this.typeFilter || undefined,
      priority: this.priorityFilter || undefined,
      search: this.searchQuery || undefined,
      page: this.page(),
      limit: 20
    }).subscribe({
      next: (data) => {
        this.tickets.set(data.tickets);
        this.total.set(data.pagination.total);
        this.totalPages.set(data.pagination.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  goToPage(p: number) {
    this.page.set(p);
    this.loadTickets();
  }

  clearFilters() {
    this.statusFilter = '';
    this.typeFilter = '';
    this.priorityFilter = '';
    this.loadTickets();
  }

  statusLabel(s: TicketStatus) { return STATUS_LABELS[s]; }
  typeLabel(t: TicketType) { return TYPE_LABELS[t]; }
  priorityLabel(p: TicketPriority) { return PRIORITY_LABELS[p]; }
}
