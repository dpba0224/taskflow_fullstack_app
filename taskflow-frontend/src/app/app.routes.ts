import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/app-shell/app-shell.component').then(m => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'tickets', pathMatch: 'full' },
      {
        path: 'tickets',
        loadComponent: () => import('./features/tickets/ticket-list/ticket-list.component').then(m => m.TicketListComponent)
      },
      {
        path: 'board',
        loadComponent: () => import('./features/tickets/ticket-board/ticket-board.component').then(m => m.TicketBoardComponent)
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./features/tickets/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/standup-report/standup-report.component').then(m => m.StandupReportComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
