import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket, TicketStatus, TICKET_STATUSES, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, TYPE_LABELS } from '../../../core/models/ticket.model';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

const STATUS_COLORS: Record<string, string> = {
  'OPEN': '#3b82f6',
  'IN_PROGRESS': '#f59e0b',
  'IN_REVIEW': '#8b5cf6',
  'RESOLVED': '#10b981',
  'CLOSED': '#737373',
};

@Component({
  selector: 'app-ticket-board',
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './ticket-board.component.html',
  styleUrl: './ticket-board.component.css'
})
export class TicketBoardComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  loading = signal(true);
  columns: TicketStatus[] = TICKET_STATUSES;
  dragOverStatus: TicketStatus | null = null;

  private draggedTicket: Ticket | null = null;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.loading.set(true);
    this.ticketService.getTickets({ limit: 200 }).subscribe({
      next: (data) => {
        this.tickets.set(data.tickets);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getColumn(status: TicketStatus): Ticket[] {
    return this.tickets().filter(t => t.status === status);
  }

  onDragStart(event: DragEvent, ticket: Ticket) {
    this.draggedTicket = ticket;
    event.dataTransfer?.setData('text/plain', ticket.id);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent, status: TicketStatus) {
    const target = event.currentTarget as HTMLElement;
    if (!target.contains(event.relatedTarget as Node)) {
      if (this.dragOverStatus === status) {
        this.dragOverStatus = null;
      }
    }
  }

  onDrop(event: DragEvent, status: TicketStatus) {
    event.preventDefault();
    this.dragOverStatus = null;
    if (this.draggedTicket && this.draggedTicket.status !== status) {
      this.ticketService.updateTicket(this.draggedTicket.id, { status }).subscribe(() => {
        this.loadTickets();
      });
    }
    this.draggedTicket = null;
  }

  statusLabel(s: TicketStatus) { return STATUS_LABELS[s]; }
  statusColor(s: TicketStatus) { return STATUS_COLORS[s] || '#737373'; }
  priorityLabel(p: string) { return (PRIORITY_LABELS as Record<string, string>)[p] || p; }
  priorityColor(p: string) { return (PRIORITY_COLORS as Record<string, string>)[p] || '#737373'; }
  typeLabel(t: string) { return (TYPE_LABELS as Record<string, string>)[t] || t; }
}
