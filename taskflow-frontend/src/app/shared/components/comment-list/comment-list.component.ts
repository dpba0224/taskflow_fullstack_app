import { Component, OnInit, OnDestroy, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Comment } from '../../../core/models/comment.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-comment-list',
  imports: [CommonModule, FormsModule, DateFormatPipe, MarkdownPipe],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent implements OnInit, OnDestroy {
  ticketId = input.required<string>();
  comments = signal<Comment[]>([]);
  editingId = signal<string | null>(null);
  editContent = '';
  newContent = '';

  private destroy$ = new Subject<void>();

  constructor(private commentService: CommentService, private auth: AuthService) {}

  currentUserId() { return this.auth.user()?.id; }
  currentUserInitials() {
    const u = this.auth.user();
    return u ? (u.firstName?.charAt(0) ?? '') + (u.lastName?.charAt(0) ?? '') : '';
  }

  ngOnInit() {
    this.loadComments();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadComments() {
    this.commentService.getComments(this.ticketId()).pipe(takeUntil(this.destroy$)).subscribe({
      next: (c) => this.comments.set(c),
      error: () => {}
    });
  }

  addComment() {
    if (!this.newContent.trim()) return;
    this.commentService.addComment(this.ticketId(), this.newContent).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.newContent = '';
        this.loadComments();
      },
      error: () => {}
    });
  }

  startEdit(comment: Comment) {
    this.editingId.set(comment.id);
    this.editContent = comment.content;
  }

  saveEdit(id: string) {
    this.commentService.updateComment(id, this.editContent).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.editingId.set(null);
        this.loadComments();
      },
      error: () => {}
    });
  }

  deleteComment(id: string) {
    this.commentService.deleteComment(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.loadComments(),
      error: () => {}
    });
  }
}
