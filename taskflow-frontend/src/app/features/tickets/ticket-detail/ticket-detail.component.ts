import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TicketService } from '../../../core/services/ticket.service';
import { UserService } from '../../../core/services/user.service';
import { Ticket, TICKET_STATUSES, TICKET_PRIORITIES, TICKET_TYPES, STATUS_LABELS, TYPE_LABELS, PRIORITY_LABELS, PRIORITY_COLORS, TicketStatus, TicketType, TicketPriority } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';
import { CommentListComponent } from '../../../shared/components/comment-list/comment-list.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { MarkdownPipe } from '../../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-ticket-detail',
  imports: [CommonModule, FormsModule, CommentListComponent, FileUploadComponent, LoaderComponent, DateFormatPipe, MarkdownPipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  ticket = signal<Ticket | null>(null);
  loading = signal(true);
  users = signal<User[]>([]);

  statuses = TICKET_STATUSES;
  types = TICKET_TYPES;
  priorities = TICKET_PRIORITIES;

  // Editing state
  editingTitle = signal(false);
  editTitleValue = '';

  editingDescription = signal(false);
  editDescriptionValue = '';

  editingTags = signal(false);
  editTagsValue = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ticketService.getTicketById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (t) => {
        this.ticket.set(t);
        this.loading.set(false);
      },
      error: () => this.router.navigate(['/tickets'])
    });
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe(u => this.users.set(u));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateField(field: string, value: string) {
    const t = this.ticket();
    if (!t) return;
    this.ticketService.updateTicket(t.id, { [field]: value }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (updated) => this.ticket.set(updated),
      error: () => {}
    });
  }

  // Title editing
  startEditTitle() {
    const t = this.ticket();
    if (!t) return;
    this.editTitleValue = t.title;
    this.editingTitle.set(true);
  }

  saveTitle() {
    const t = this.ticket();
    if (!t) { this.editingTitle.set(false); return; }
    const val = this.editTitleValue.trim();
    if (val && val !== t.title) {
      this.ticketService.updateTicket(t.id, { title: val } as any).pipe(takeUntil(this.destroy$)).subscribe({
        next: (updated) => this.ticket.set(updated),
        error: () => {}
      });
    }
    this.editingTitle.set(false);
  }

  cancelEditTitle() {
    this.editingTitle.set(false);
  }

  // Description editing
  startEditDescription() {
    const t = this.ticket();
    if (!t) return;
    this.editDescriptionValue = t.description;
    this.editingDescription.set(true);
  }

  saveDescription() {
    const t = this.ticket();
    if (!t) { this.editingDescription.set(false); return; }
    const val = this.editDescriptionValue.trim();
    if (val !== t.description) {
      this.ticketService.updateTicket(t.id, { description: val } as any).pipe(takeUntil(this.destroy$)).subscribe({
        next: (updated) => this.ticket.set(updated),
        error: () => {}
      });
    }
    this.editingDescription.set(false);
  }

  cancelEditDescription() {
    this.editingDescription.set(false);
  }

  // Tags editing
  startEditTags() {
    const t = this.ticket();
    if (!t) return;
    this.editTagsValue = t.tags.join(', ');
    this.editingTags.set(true);
  }

  saveTags() {
    const t = this.ticket();
    if (!t) { this.editingTags.set(false); return; }
    const tags = this.editTagsValue.split(',').map(s => s.trim()).filter(Boolean);
    this.ticketService.updateTicket(t.id, { tags } as any).pipe(takeUntil(this.destroy$)).subscribe({
      next: (updated) => this.ticket.set(updated),
      error: () => {}
    });
    this.editingTags.set(false);
  }

  cancelEditTags() {
    this.editingTags.set(false);
  }

  // Due date
  updateDueDate(value: string) {
    const t = this.ticket();
    if (!t) return;
    const dueDate = value ? new Date(value).toISOString() : undefined;
    this.ticketService.updateTicket(t.id, { dueDate } as any).pipe(takeUntil(this.destroy$)).subscribe({
      next: (updated) => this.ticket.set(updated),
      error: () => {}
    });
  }

  deleteTicket() {
    const t = this.ticket();
    if (!t) return;
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(t.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.router.navigate(['/tickets']),
        error: () => {}
      });
    }
  }

  statusLabel(s: TicketStatus) { return STATUS_LABELS[s]; }
  typeLabel(t: TicketType) { return TYPE_LABELS[t]; }
  priorityLabel(p: TicketPriority) { return PRIORITY_LABELS[p]; }
  priorityColor(p: TicketPriority) { return PRIORITY_COLORS[p]; }
}
