import { Component, signal, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, FileText, Upload, Loader2, CheckCircle2, AlertCircle, Timer, X } from 'lucide-angular';
import { StudentService } from '../../services/student.service';

@Component({
    selector: 'app-data-upload',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="card">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-emerald-500/20 rounded-xl">
          <lucide-icon name="file-text" class="w-6 h-6 text-emerald-400"></lucide-icon>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white">Data Upload</h2>
          <p class="text-slate-400 text-sm">Task C: Upload CSV to database</p>
        </div>
      </div>
      
      <div class="space-y-4">
        <div 
          class="file-upload-zone"
          [class.dragover]="isDragOver()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()"
        >
          <input 
            #fileInput
            type="file" 
            accept=".csv"
            (change)="onFileSelected($event)"
            class="hidden"
          />
          
          @if (!selectedFile()) {
            <div class="space-y-3">
              <div class="mx-auto w-14 h-14 bg-slate-700/50 rounded-full flex items-center justify-center">
                <lucide-icon name="upload" class="w-7 h-7 text-slate-400"></lucide-icon>
              </div>
              <div>
                <p class="text-white font-medium">Drop your CSV file here</p>
                <p class="text-slate-400 text-sm mt-1">or click to browse</p>
              </div>
              <p class="text-slate-500 text-xs">Supports: .csv</p>
            </div>
          } @else {
            <div class="space-y-2">
              <div class="flex items-center justify-center gap-2 text-emerald-400">
                <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
                <span class="font-medium">{{ selectedFile()?.name }}</span>
                <button 
                  (click)="clearFile($event)"
                  class="p-1 hover:bg-slate-700 rounded-full transition-colors"
                >
                  <lucide-icon name="x" class="w-4 h-4 text-slate-400"></lucide-icon>
                </button>
              </div>
              <p class="text-slate-400 text-sm">{{ formatFileSize(selectedFile()?.size || 0) }}</p>
            </div>
          }
        </div>
        
        <button 
          (click)="upload()"
          [disabled]="!selectedFile() || studentService.isUploading()"
          class="btn-primary w-full flex items-center justify-center gap-2"
        >
          @if (studentService.isUploading()) {
            <lucide-icon name="loader-2" class="w-5 h-5 animate-spin"></lucide-icon>
            <span>Uploading...</span>
          } @else {
            <lucide-icon name="upload" class="w-5 h-5"></lucide-icon>
            <span>Upload to Database</span>
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
              @if (recordsInserted()) {
                <p class="text-sm opacity-80 mt-1">Records inserted: {{ recordsInserted()?.toLocaleString() }}</p>
              }
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
export class DataUploadComponent {
    @Output() uploadComplete = new EventEmitter<void>();

    studentService = inject(StudentService);

    selectedFile = signal<File | null>(null);
    isDragOver = signal(false);
    status = signal<string | null>(null);
    isSuccess = signal(false);
    performanceTime = signal<number | null>(null);
    recordsInserted = signal<number | null>(null);

    statusClass() {
        return this.isSuccess()
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border border-red-500/30 text-red-300';
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(true);
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.csv')) {
                this.selectedFile.set(file);
                this.status.set(null);
                this.performanceTime.set(null);
                this.recordsInserted.set(null);
            }
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile.set(input.files[0]);
            this.status.set(null);
            this.performanceTime.set(null);
            this.recordsInserted.set(null);
        }
    }

    clearFile(event: Event) {
        event.stopPropagation();
        this.selectedFile.set(null);
        this.status.set(null);
    }

    upload() {
        const file = this.selectedFile();
        if (!file) return;

        this.status.set(null);
        this.performanceTime.set(null);
        this.recordsInserted.set(null);

        this.studentService.uploadCsv(file).subscribe({
            next: (response) => {
                this.studentService.isUploading.set(false);
                this.isSuccess.set(true);
                this.status.set(response.message || 'CSV successfully uploaded to database');
                this.performanceTime.set(response.timeInMillis);
                this.recordsInserted.set(response.recordsInserted);
                this.studentService.lastUploadTime.set(response.timeInMillis);
                this.uploadComplete.emit();
            },
            error: (error) => {
                this.studentService.isUploading.set(false);
                this.isSuccess.set(false);
                this.status.set(error.message);
            }
        });
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatTime(millis: number): string {
        if (millis < 1000) return `${millis}ms`;
        if (millis < 60000) return `${(millis / 1000).toFixed(2)}s`;
        return `${(millis / 60000).toFixed(2)} min`;
    }
}
