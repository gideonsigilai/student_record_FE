import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule, icons } from 'lucide-angular';
import { DataGenerationComponent } from './components/data-generation/data-generation.component';
import { DataProcessingComponent } from './components/data-processing/data-processing.component';
import { DataUploadComponent } from './components/data-upload/data-upload.component';
import { StudentReportComponent } from './components/student-report/student-report.component';
import { PerformanceFooterComponent } from './components/performance-footer/performance-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LucideAngularModule,
    DataGenerationComponent,
    DataProcessingComponent,
    DataUploadComponent,
    StudentReportComponent,
    PerformanceFooterComponent
  ],
  template: `
    <div class="min-h-screen bg-slate-900 flex flex-col">
      <!-- Main Content -->
      <main class="flex-1 p-6 lg:p-8 overflow-auto">
        <div class="max-w-7xl mx-auto space-y-6">
          <!-- Task Cards Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <app-data-generation id="task-a"></app-data-generation>
            <app-data-processing id="task-b"></app-data-processing>
            <app-data-upload id="task-c" (uploadComplete)="onUploadComplete()"></app-data-upload>
          </div>
          
          <!-- Report Section -->
          <div id="task-d" class="min-h-[500px]">
            <app-student-report #reportComponent></app-student-report>
          </div>
        </div>
      </main>
      
      <!-- Performance Footer -->
      <app-performance-footer></app-performance-footer>
    </div>
  `
})
export class AppComponent {
  @ViewChild('reportComponent') reportComponent!: StudentReportComponent;

  onUploadComplete() {
    // Refresh report data
    if (this.reportComponent) {
      this.reportComponent.loadReport();
    }
  }
}
