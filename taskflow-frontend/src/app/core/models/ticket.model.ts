import { User } from './user.model';

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  assignee?: User;
  reporter?: User;
  dueDate?: string;
  tags: string[];
  attachments: string[];
  commentCount: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketType = 'BUG' | 'FEATURE_REQUEST' | 'SUPPORT_TICKET' | 'TASK';
export type TicketPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TicketStatus = 'BACKLOG' | 'TO_DO' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'FOR_CONFIRMATION' | 'COMPLETED' | 'DELETED';

export interface TicketRequest {
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status?: TicketStatus;
  assigneeId?: string;
  dueDate?: string;
  tags?: string[];
}

export interface TicketPage {
  tickets: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const TICKET_STATUSES: TicketStatus[] = ['BACKLOG', 'TO_DO', 'ACKNOWLEDGED', 'IN_PROGRESS', 'FOR_CONFIRMATION', 'COMPLETED'];
export const TICKET_TYPES: TicketType[] = ['BUG', 'FEATURE_REQUEST', 'SUPPORT_TICKET', 'TASK'];
export const TICKET_PRIORITIES: TicketPriority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  BACKLOG: 'Backlog',
  TO_DO: 'To Do',
  ACKNOWLEDGED: 'Acknowledged',
  IN_PROGRESS: 'In Progress',
  FOR_CONFIRMATION: 'For Confirmation',
  COMPLETED: 'Completed',
  DELETED: 'Deleted',
};

export const TYPE_LABELS: Record<TicketType, string> = {
  BUG: 'Bug',
  FEATURE_REQUEST: 'Feature Request',
  SUPPORT_TICKET: 'Support Ticket',
  TASK: 'Task',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f59e0b',
  MEDIUM: '#3b82f6',
  LOW: '#10b981',
};
