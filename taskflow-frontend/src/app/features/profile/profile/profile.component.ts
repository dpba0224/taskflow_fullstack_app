import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  firstName = '';
  lastName = '';
  currentPassword = '';
  newPassword = '';
  success = signal('');
  error = signal('');
  uploadingAvatar = signal(false);

  constructor(public auth: AuthService, private http: HttpClient) {
    const user = this.auth.user();
    if (user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    }
  }

  onAvatarFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    input.value = '';

    if (file.size > 5 * 1024 * 1024) {
      this.error.set('Image must be under 5 MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.error.set('Please select an image file');
      return;
    }

    this.uploadingAvatar.set(true);
    this.error.set('');
    this.success.set('');

    const formData = new FormData();
    formData.append('file', file);

    this.http.put<{ success: boolean; data: any }>(
      `${environment.apiUrl}/auth/avatar`, formData
    ).subscribe({
      next: (res) => {
        this.auth.refreshCurrentUser().subscribe({
          next: () => {
            this.uploadingAvatar.set(false);
            this.success.set('Profile picture updated successfully');
          },
          error: () => {
            this.uploadingAvatar.set(false);
            this.success.set('Profile picture updated, but failed to refresh profile');
          }
        });
      },
      error: (err) => {
        this.uploadingAvatar.set(false);
        this.error.set(err.error?.message || 'Failed to upload profile picture');
      }
    });
  }

  updateProfile() {
    this.success.set('');
    this.error.set('');
    this.auth.updateProfile({ firstName: this.firstName, lastName: this.lastName }).subscribe({
      next: () => this.success.set('Profile updated successfully'),
      error: (err) => this.error.set(err.error?.message || 'Failed to update profile')
    });
  }

  changePassword() {
    this.success.set('');
    this.error.set('');
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.success.set('Password updated successfully');
        this.currentPassword = '';
        this.newPassword = '';
      },
      error: (err) => this.error.set(err.error?.message || 'Failed to change password')
    });
  }
}
