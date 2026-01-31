import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, StandupReport } from '../../../core/services/report.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-standup-report',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './standup-report.component.html',
  styleUrl: './standup-report.component.css'
})
export class StandupReportComponent {
  report = signal<StandupReport | null>(null);
  loading = signal(false);
  copied = signal(false);

  constructor(private reportService: ReportService) {}

  generate() {
    this.loading.set(true);
    this.reportService.getStandupReport().subscribe({
      next: (r) => {
        this.report.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  copyToClipboard() {
    if (this.report()?.markdown) {
      navigator.clipboard.writeText(this.report()!.markdown);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }
}
