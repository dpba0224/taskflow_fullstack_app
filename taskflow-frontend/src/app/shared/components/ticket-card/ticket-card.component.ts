import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ticket, PRIORITY_COLORS, PRIORITY_LABELS, TYPE_LABELS, STATUS_LABELS } from '../../../core/models/ticket.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

const STATUS_COLORS: Record<string, string> = {
  'BACKLOG': '#6b7280',
  'TO_DO': '#3b82f6',
  'ACKNOWLEDGED': '#eab308',
  'IN_PROGRESS': '#f59e0b',
  'FOR_CONFIRMATION': '#8b5cf6',
  'COMPLETED': '#10b981',
  'DELETED': '#6b7280',
};

const TYPE_COLORS: Record<string, string> = {
  'BUG': '#3b82f6',
  'FEATURE_REQUEST': '#8b5cf6',
  'SUPPORT_TICKET': '#06b6d4',
  'TASK': '#6b7280',
};

@Component({
  selector: 'app-ticket-card',
  imports: [RouterLink, DateFormatPipe],
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.css'
})
export class TicketCardComponent {
  ticket = input.required<Ticket>();

  priorityColor() {
    return PRIORITY_COLORS[this.ticket().priority] || '#737373';
  }
  priorityLabel() {
    return PRIORITY_LABELS[this.ticket().priority] || this.ticket().priority;
  }
  typeLabel() {
    return TYPE_LABELS[this.ticket().type] || this.ticket().type;
  }
  typeColor() {
    return TYPE_COLORS[this.ticket().type] || '#737373';
  }
  statusLabel() {
    return STATUS_LABELS[this.ticket().status] || this.ticket().status;
  }
  statusColor() {
    return STATUS_COLORS[this.ticket().status] || '#737373';
  }
}
