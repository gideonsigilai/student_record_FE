import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Database, Loader2, CheckCircle2, AlertCircle, Timer } from 'lucide-angular';
import { StudentService } from '../../services/student.service';

@Component({
    selector: 'app-data-generation',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="card">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-indigo-500/20 rounded-xl">
          <lucide-icon name="database" class="w-6 h-6 text-indigo-400"></lucide-icon>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white">Data Generation</h2>
          <p class="text-slate-400 text-sm">Task A: Generate student records</p>
        </div>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Number of Records
          </label>
          <input 
            type="number" 
            [(ngModel)]="recordCount"
            [disabled]="studentService.isGenerating()"
            class="input-field w-full"
            placeholder="Enter number of records"
            min="1"
          />
        </div>
        
        <button 
          (click)="generate()"
          [disabled]="studentService.isGenerating() || recordCount() <= 0"
          class="btn-primary w-full flex items-center justify-center gap-2"
        >
          @if (studentService.isGenerating()) {
            <lucide-icon name="loader-2" class="w-5 h-5 animate-spin"></lucide-icon>
            <span>Generating...</span>
          } @else {
            <lucide-icon name="database" class="w-5 h-5"></lucide-icon>
            <span>Generate Records</span>
          }
        </button>
        
        @if (status()) {
          <div [class]="statusClass()" class="p-4 rounded-lg flex items-start gap-3">
            @if (isSuccess()) {
              <lucide-icon name="check-circle-2" class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"></lucide-icon>
            } @else {
              <lucide-icon name="alert-circle" class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"></lucide-icon>
            }
            <div>
              <p class="font-medium">{{ status() }}</p>
              @if (performanceTime() !== null) {
                <div class="flex items-center gap-2 mt-2 text-sm opacity-80">
                  <lucide-icon name="timer" class="w-4 h-4"></lucide-icon>
                  <span>Time: {{ formatTime(performanceTime()!) }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DataGenerationComponent {
    studentService = inject(StudentService);

    recordCount = signal(1000000);
    status = signal<string | null>(null);
    isSuccess = signal(false);
    performanceTime = signal<number | null>(null);

    statusClass() {
        return this.isSuccess()
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border border-red-500/30 text-red-300';
    }

    generate() {
        this.status.set(null);
        this.performanceTime.set(null);

        this.studentService.generateData(this.recordCount()).subscribe({
            next: (response) => {
                this.studentService.isGenerating.set(false);
                this.isSuccess.set(true);
                this.status.set(`Successfully generated ${response.count.toLocaleString()} records`);
                this.performanceTime.set(response.timeInMillis);
                this.studentService.lastGenerateTime.set(response.timeInMillis);
            },
            error: (error) => {
                this.studentService.isGenerating.set(false);
                this.isSuccess.set(false);
                this.status.set(error.message);
            }
        });
    }

    formatTime(millis: number): string {
        if (millis < 1000) return `${millis}ms`;
        if (millis < 60000) return `${(millis / 1000).toFixed(2)}s`;
        return `${(millis / 60000).toFixed(2)} min`;
    }
}
