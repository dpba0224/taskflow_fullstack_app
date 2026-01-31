import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  imports: [CommonModule, FormsModule, RouterLink, CommentListComponent, FileUploadComponent, LoaderComponent, DateFormatPipe, MarkdownPipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket.set(t);
        this.loading.set(false);
      },
      error: () => this.router.navigate(['/tickets'])
    });
    this.userService.getAllUsers().subscribe(u => this.users.set(u));
  }

  updateField(field: string, value: string) {
    this.ticketService.updateTicket(this.ticket()!.id, { [field]: value }).subscribe(
      (t) => this.ticket.set(t)
    );
  }

  // Title editing
  startEditTitle() {
    this.editTitleValue = this.ticket()!.title;
    this.editingTitle.set(true);
  }

  saveTitle() {
    const val = this.editTitleValue.trim();
    if (val && val !== this.ticket()!.title) {
      this.ticketService.updateTicket(this.ticket()!.id, { title: val } as any).subscribe(
        (t) => this.ticket.set(t)
      );
    }
    this.editingTitle.set(false);
  }

  cancelEditTitle() {
    this.editingTitle.set(false);
  }

  // Description editing
  startEditDescription() {
    this.editDescriptionValue = this.ticket()!.description;
    this.editingDescription.set(true);
  }

  saveDescription() {
    const val = this.editDescriptionValue.trim();
    if (val !== this.ticket()!.description) {
      this.ticketService.updateTicket(this.ticket()!.id, { description: val } as any).subscribe(
        (t) => this.ticket.set(t)
      );
    }
    this.editingDescription.set(false);
  }

  cancelEditDescription() {
    this.editingDescription.set(false);
  }

  // Tags editing
  startEditTags() {
    this.editTagsValue = this.ticket()!.tags.join(', ');
    this.editingTags.set(true);
  }

  saveTags() {
    const tags = this.editTagsValue.split(',').map(t => t.trim()).filter(Boolean);
    this.ticketService.updateTicket(this.ticket()!.id, { tags } as any).subscribe(
      (t) => this.ticket.set(t)
    );
    this.editingTags.set(false);
  }

  cancelEditTags() {
    this.editingTags.set(false);
  }

  // Due date
  updateDueDate(value: string) {
    const dueDate = value ? new Date(value).toISOString() : undefined;
    this.ticketService.updateTicket(this.ticket()!.id, { dueDate } as any).subscribe(
      (t) => this.ticket.set(t)
    );
  }

  deleteTicket() {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(this.ticket()!.id).subscribe(
        () => this.router.navigate(['/tickets'])
      );
    }
  }

  statusLabel(s: TicketStatus) { return STATUS_LABELS[s]; }
  typeLabel(t: TicketType) { return TYPE_LABELS[t]; }
  priorityLabel(p: TicketPriority) { return PRIORITY_LABELS[p]; }
  priorityColor(p: TicketPriority) { return PRIORITY_COLORS[p]; }
}
