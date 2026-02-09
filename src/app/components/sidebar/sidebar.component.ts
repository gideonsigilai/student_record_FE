import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, GraduationCap, LayoutDashboard, Database, FileSpreadsheet, Upload, Table2, Menu, X } from 'lucide-angular';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <!-- Mobile Menu Button -->
    <button 
      (click)="toggleSidebar()"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg border border-slate-700 shadow-lg"
    >
      @if (isOpen()) {
        <lucide-icon name="x" class="w-6 h-6 text-white"></lucide-icon>
      } @else {
        <lucide-icon name="menu" class="w-6 h-6 text-white"></lucide-icon>
      }
    </button>
    
    <!-- Overlay -->
    @if (isOpen()) {
      <div 
        (click)="closeSidebar()"
        class="lg:hidden fixed inset-0 bg-black/50 z-30"
      ></div>
    }
    
    <!-- Sidebar -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 
             transform transition-transform duration-300 ease-in-out lg:transform-none"
      [class.translate-x-0]="isOpen()"
      [class.-translate-x-full]="!isOpen()"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-6 border-b border-slate-700/50">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
              <lucide-icon name="graduation-cap" class="w-7 h-7 text-white"></lucide-icon>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">StudentHub</h1>
              <p class="text-xs text-slate-400">Management System</p>
            </div>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1">
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Operations
          </div>
          
          <a 
            href="#dashboard"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          >
            <lucide-icon name="layout-dashboard" class="w-5 h-5"></lucide-icon>
            <span class="font-medium">Dashboard</span>
          </a>
          
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mt-6 mb-3">
            Tasks
          </div>
          
          <a 
            href="#task-a"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
          >
            <lucide-icon name="database" class="w-5 h-5 text-indigo-400"></lucide-icon>
            <span>Data Generation</span>
            <span class="ml-auto text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">A</span>
          </a>
          
          <a 
            href="#task-b"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
          >
            <lucide-icon name="file-spreadsheet" class="w-5 h-5 text-purple-400"></lucide-icon>
            <span>Data Processing</span>
            <span class="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">B</span>
          </a>
          
          <a 
            href="#task-c"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
          >
            <lucide-icon name="upload" class="w-5 h-5 text-emerald-400"></lucide-icon>
            <span>Data Upload</span>
            <span class="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">C</span>
          </a>
          
          <a 
            href="#task-d"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
          >
            <lucide-icon name="table-2" class="w-5 h-5 text-cyan-400"></lucide-icon>
            <span>Student Report</span>
            <span class="ml-auto text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">D</span>
          </a>
        </nav>
        
        <!-- Footer -->
        <div class="p-4 border-t border-slate-700/50">
          <div class="bg-slate-700/30 rounded-lg p-3">
            <p class="text-xs text-slate-400">Technical Assessment</p>
            <p class="text-sm font-medium text-white mt-1">Spring Boot + Angular</p>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
    isOpen = signal(false);

    toggleSidebar() {
        this.isOpen.update(v => !v);
    }

    closeSidebar() {
        this.isOpen.set(false);
    }
}
