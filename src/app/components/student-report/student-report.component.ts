import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Table2, Search, Filter, Download, FileSpreadsheet, FileText, File, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, RefreshCw } from 'lucide-angular';
import { StudentService, Student, PagedResponse } from '../../services/student.service';

@Component({
    selector: 'app-student-report',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="card h-full flex flex-col">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-cyan-500/20 rounded-xl">
            <lucide-icon name="table-2" class="w-6 h-6 text-cyan-400"></lucide-icon>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Student Report</h2>
            <p class="text-slate-400 text-sm">Task D: View and filter records</p>
          </div>
        </div>
        
        <button 
          (click)="loadReport()"
          [disabled]="studentService.isLoadingReport()"
          class="btn-secondary flex items-center gap-2"
        >
          <lucide-icon 
            name="refresh-cw" 
            class="w-4 h-4"
            [class.animate-spin]="studentService.isLoadingReport()"
          ></lucide-icon>
          <span>Refresh</span>
        </button>
      </div>
      
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="relative flex-1">
          <lucide-icon name="search" class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></lucide-icon>
          <input 
            type="text"
            [(ngModel)]="searchId"
            (keyup.enter)="loadReport()"
            placeholder="Search by Student ID..."
            class="input-field w-full pl-10"
          />
        </div>
        
        <div class="relative">
          <lucide-icon name="filter" class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></lucide-icon>
          <select 
            [(ngModel)]="selectedClass"
            (change)="loadReport()"
            class="input-field pl-10 pr-8 appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">All Classes</option>
            <option value="Class1">Class 1</option>
            <option value="Class2">Class 2</option>
            <option value="Class3">Class 3</option>
            <option value="Class4">Class 4</option>
            <option value="Class5">Class 5</option>
          </select>
        </div>
        
        <!-- Export Buttons -->
        <div class="flex gap-2">
          <button class="btn-secondary flex items-center gap-2 text-sm" title="Export to Excel">
            <lucide-icon name="file-spreadsheet" class="w-4 h-4 text-emerald-400"></lucide-icon>
            <span class="hidden sm:inline">Excel</span>
          </button>
          <button class="btn-secondary flex items-center gap-2 text-sm" title="Export to CSV">
            <lucide-icon name="file-text" class="w-4 h-4 text-blue-400"></lucide-icon>
            <span class="hidden sm:inline">CSV</span>
          </button>
          <button class="btn-secondary flex items-center gap-2 text-sm" title="Export to PDF">
            <lucide-icon name="file" class="w-4 h-4 text-red-400"></lucide-icon>
            <span class="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>
      
      <!-- Table -->
      <div class="flex-1 overflow-auto rounded-lg border border-slate-700/50">
        <table class="w-full">
          <thead class="table-header sticky top-0">
            <tr>
              <th class="text-left px-4 py-3">Student ID</th>
              <th class="text-left px-4 py-3">First Name</th>
              <th class="text-left px-4 py-3">Last Name</th>
              <th class="text-left px-4 py-3">DOB</th>
              <th class="text-left px-4 py-3">Class</th>
              <th class="text-right px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            @if (studentService.isLoadingReport()) {
              <tr>
                <td colspan="6" class="text-center py-12">
                  <div class="flex flex-col items-center gap-3">
                    <lucide-icon name="loader-2" class="w-8 h-8 text-indigo-400 animate-spin"></lucide-icon>
                    <span class="text-slate-400">Loading students...</span>
                  </div>
                </td>
              </tr>
            } @else if (students().length === 0) {
              <tr>
                <td colspan="6" class="text-center py-12">
                  <div class="flex flex-col items-center gap-3">
                    <lucide-icon name="table-2" class="w-8 h-8 text-slate-500"></lucide-icon>
                    <span class="text-slate-400">No students found</span>
                  </div>
                </td>
              </tr>
            } @else {
              @for (student of students(); track student.studentId) {
                <tr class="table-row">
                  <td class="px-4 py-3 font-mono text-indigo-300">{{ student.studentId }}</td>
                  <td class="px-4 py-3">{{ student.firstName }}</td>
                  <td class="px-4 py-3">{{ student.lastName }}</td>
                  <td class="px-4 py-3 text-slate-400">{{ student.dob }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-slate-700 rounded text-sm">{{ student.class }}</span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <span [class]="getScoreClass(student.score)">{{ student.score }}</span>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-700/50">
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-400">Show records</span>
          <select 
            [(ngModel)]="pageSize"
            (change)="onPageSizeChange()"
            class="bg-slate-800 border border-slate-600 text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option [value]="10">10</option>
            <option [value]="25">25</option>
            <option [value]="50">50</option>
            <option [value]="100">100</option>
          </select>
        </div>
        
        <div class="flex items-center gap-1">
          <button 
            (click)="previousPage()"
            [disabled]="currentPage() === 0"
            class="px-3 py-1 border border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >&lsaquo;</button>
          
          @for (page of visiblePages(); track page) {
            @if (page === -1) {
              <span class="px-2 py-1 text-slate-500">...</span>
            } @else {
              <button 
                (click)="goToPage(page)"
                [class]="page === currentPage() 
                  ? 'px-3 py-1 bg-slate-600 text-white border border-slate-500 text-sm font-medium' 
                  : 'px-3 py-1 border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm'"
              >{{ page + 1 }}</button>
            }
          }
          
          <button 
            (click)="nextPage()"
            [disabled]="currentPage() >= totalPages() - 1"
            class="px-3 py-1 border border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >&rsaquo;</button>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-400">Go to page</span>
          <input 
            type="number"
            [(ngModel)]="jumpToPageInput"
            min="1"
            [max]="totalPages() || 1"
            class="bg-slate-800 border border-slate-600 text-white text-sm rounded px-2 py-1 w-16 text-center focus:outline-none focus:border-indigo-500"
          />
          <button 
            (click)="jumpToPage()"
            class="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm border border-slate-500"
          >Go</button>
        </div>
      </div>
    </div>
  `
})
export class StudentReportComponent implements OnInit {
    studentService = inject(StudentService);

    students = signal<Student[]>([]);
    totalElements = signal(0);
    totalPages = signal(0);
    currentPage = signal(0);
    pageSize = signal(10);
    searchId = signal('');
    selectedClass = signal('');
    jumpToPageInput = signal(1);

    startRecord = computed(() => this.totalElements() === 0 ? 0 : this.currentPage() * this.pageSize() + 1);
    endRecord = computed(() => Math.min((this.currentPage() + 1) * this.pageSize(), this.totalElements()));
    
    visiblePages = computed(() => {
        const total = this.totalPages();
        const current = this.currentPage();
        const pages: number[] = [];
        
        if (total <= 8) {
            for (let i = 0; i < total; i++) pages.push(i);
        } else {
            pages.push(0);
            if (current > 3) pages.push(-1);
            
            const start = Math.max(1, current - 2);
            const end = Math.min(total - 2, current + 2);
            
            for (let i = start; i <= end; i++) pages.push(i);
            
            if (current < total - 4) pages.push(-1);
            pages.push(total - 1);
        }
        return pages;
    });

    ngOnInit() {
        this.loadReport();
    }

    loadReport() {
        this.studentService.getReport({
            page: this.currentPage(),
            size: this.pageSize(),
            studentId: this.searchId() || undefined,
            studentClass: this.selectedClass() || undefined
        }).subscribe({
            next: (response) => {
                this.studentService.isLoadingReport.set(false);
                this.students.set(response.content);
                this.totalElements.set(response.totalElements);
                this.totalPages.set(response.totalPages);
                this.jumpToPageInput.set(this.currentPage() + 1);
            },
            error: () => {
                this.studentService.isLoadingReport.set(false);
                this.students.set([]);
                this.totalElements.set(0);
                this.totalPages.set(0);
            }
        });
    }

    onPageSizeChange() {
        this.currentPage.set(0);
        this.loadReport();
    }

    previousPage() {
        if (this.currentPage() > 0) {
            this.currentPage.update(p => p - 1);
            this.loadReport();
        }
    }

    nextPage() {
        if (this.currentPage() < this.totalPages() - 1) {
            this.currentPage.update(p => p + 1);
            this.loadReport();
        }
    }

    goToPage(page: number) {
        if (page >= 0 && page < this.totalPages()) {
            this.currentPage.set(page);
            this.loadReport();
        }
    }

    jumpToPage() {
        const page = this.jumpToPageInput() - 1;
        if (page >= 0 && page < this.totalPages()) {
            this.currentPage.set(page);
            this.loadReport();
        } else {
            this.jumpToPageInput.set(this.currentPage() + 1);
        }
    }

    getScoreClass(score: number): string {
        if (score >= 90) return 'text-emerald-400 font-semibold';
        if (score >= 70) return 'text-blue-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    }
}
