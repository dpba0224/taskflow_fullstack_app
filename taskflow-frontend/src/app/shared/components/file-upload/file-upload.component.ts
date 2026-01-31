import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface UploadedFile {
  id: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
}

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  ticketId = input<string>();
  commentId = input<string>();
  uploaded = output<UploadedFile>();

  files = signal<UploadedFile[]>([]);
  uploading = signal(false);
  dragging = signal(false);
  error = signal('');

  private readonly api = `${environment.apiUrl}/attachments`;

  constructor(private http: HttpClient) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    const files = event.dataTransfer?.files;
    if (files) this.uploadFiles(files);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.uploadFiles(input.files);
    input.value = '';
  }

  private uploadFiles(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 10 * 1024 * 1024) {
        this.error.set(`${file.name} exceeds 10 MB limit`);
        continue;
      }
      this.uploadSingle(file);
    }
  }

  private uploadSingle(file: File) {
    this.uploading.set(true);
    this.error.set('');

    const formData = new FormData();
    formData.append('file', file);
    if (this.ticketId()) formData.append('ticketId', this.ticketId()!);
    if (this.commentId()) formData.append('commentId', this.commentId()!);

    this.http.post<{ success: boolean; data: UploadedFile }>(`${this.api}/upload`, formData).subscribe({
      next: (res) => {
        this.files.update(f => [...f, res.data]);
        this.uploaded.emit(res.data);
        this.uploading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Upload failed');
        this.uploading.set(false);
      }
    });
  }

  removeFile(id: string) {
    this.http.delete(`${this.api}/${id}`).subscribe(() => {
      this.files.update(f => f.filter(x => x.id !== id));
    });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
