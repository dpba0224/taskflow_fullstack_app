import { Component, OnInit, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TicketService } from '../../../core/services/ticket.service';
import { UserService } from '../../../core/services/user.service';
import { TICKET_TYPES, TICKET_PRIORITIES, TYPE_LABELS, PRIORITY_LABELS, TicketType, TicketPriority } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-ticket-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.css'
})
export class TicketCreateComponent implements OnInit, OnDestroy {
  close = output();

  types = TICKET_TYPES;
  priorities = TICKET_PRIORITIES;
  users = signal<User[]>([]);

  title = '';
  description = '';
  type: TicketType = 'TASK';
  priority: TicketPriority = 'MEDIUM';
  assigneeId = '';
  dueDate = '';
  tagsInput = '';

  saving = signal(false);
  error = signal('');

  private destroy$ = new Subject<void>();

  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe(users => this.users.set(users));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  typeLabel(t: TicketType) { return TYPE_LABELS[t]; }
  priorityLabel(p: TicketPriority) { return PRIORITY_LABELS[p]; }

  onSubmit() {
    this.saving.set(true);
    this.error.set('');

    const tags = this.tagsInput ? this.tagsInput.split(',').map(t => t.trim()).filter(Boolean) : undefined;

    this.ticketService.createTicket({
      title: this.title,
      description: this.description,
      type: this.type,
      priority: this.priority,
      assigneeId: this.assigneeId || undefined,
      dueDate: this.dueDate ? new Date(this.dueDate).toISOString() : undefined,
      tags
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (ticket) => {
        this.close.emit();
        this.router.navigate(['/tickets', ticket.id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Failed to create ticket');
      }
    });
  }
}
