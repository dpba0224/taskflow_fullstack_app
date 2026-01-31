import { User } from './user.model';

export interface Comment {
  id: string;
  ticketId: string;
  user?: User;
  content: string;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
}
