import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Registration failed');
      }
    });
  }
}
