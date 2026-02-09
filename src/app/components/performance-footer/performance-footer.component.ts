import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Timer, Database, FileSpreadsheet, Upload, Trash2 } from 'lucide-angular';
import { StudentService } from '../../services/student.service';

@Component({
    selector: 'app-performance-footer',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <footer class="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50 px-6 py-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <lucide-icon name="timer" class="w-5 h-5 text-indigo-400"></lucide-icon>
            <span class="text-sm font-medium text-white">Performance Tracker</span>
          </div>
          
          <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <!-- Task A -->
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" [class]="generateTime() !== null ? 'bg-emerald-400' : 'bg-slate-600'"></div>
              <lucide-icon name="database" class="w-4 h-4 text-slate-400"></lucide-icon>
              <span class="text-sm text-slate-300">Task A:</span>
              <span class="text-sm font-mono" [class]="generateTime() !== null ? 'text-emerald-400' : 'text-slate-500'">
                {{ generateTime() !== null ? formatTime(generateTime()!) : '--' }}
              </span>
            </div>
            
            <!-- Task B -->
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" [class]="processTime() !== null ? 'bg-emerald-400' : 'bg-slate-600'"></div>
              <lucide-icon name="file-spreadsheet" class="w-4 h-4 text-slate-400"></lucide-icon>
              <span class="text-sm text-slate-300">Task B:</span>
              <span class="text-sm font-mono" [class]="processTime() !== null ? 'text-emerald-400' : 'text-slate-500'">
                {{ processTime() !== null ? formatTime(processTime()!) : '--' }}
              </span>
            </div>
            
            <!-- Task C -->
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" [class]="uploadTime() !== null ? 'bg-emerald-400' : 'bg-slate-600'"></div>
              <lucide-icon name="upload" class="w-4 h-4 text-slate-400"></lucide-icon>
              <span class="text-sm text-slate-300">Task C:</span>
              <span class="text-sm font-mono" [class]="uploadTime() !== null ? 'text-emerald-400' : 'text-slate-500'">
                {{ uploadTime() !== null ? formatTime(uploadTime()!) : '--' }}
              </span>
            </div>
          </div>
          
          @if (hasAnyTime()) {
            <button 
              (click)="clearTimes()"
              class="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
              title="Clear performance logs"
            >
              <lucide-icon name="trash-2" class="w-4 h-4"></lucide-icon>
              <span class="hidden sm:inline">Clear</span>
            </button>
          }
        </div>
      </div>
    </footer>
  `
})
export class PerformanceFooterComponent {
    private studentService = inject(StudentService);

    generateTime = computed(() => this.studentService.lastGenerateTime());
    processTime = computed(() => this.studentService.lastProcessTime());
    uploadTime = computed(() => this.studentService.lastUploadTime());

    hasAnyTime = computed(() =>
        this.generateTime() !== null ||
        this.processTime() !== null ||
        this.uploadTime() !== null
    );

    formatTime(millis: number): string {
        const minutes = millis / 60000;
        if (minutes >= 1) {
            return `${minutes.toFixed(2)} min`;
        }
        const seconds = millis / 1000;
        if (seconds >= 1) {
            return `${seconds.toFixed(2)}s`;
        }
        return `${millis}ms`;
    }

    clearTimes() {
        this.studentService.lastGenerateTime.set(null);
        this.studentService.lastProcessTime.set(null);
        this.studentService.lastUploadTime.set(null);
        this.studentService.clearPerformanceLogs();
    }
}
