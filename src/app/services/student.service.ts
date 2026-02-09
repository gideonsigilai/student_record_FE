import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Student {
    studentId: string;
    firstName: string;
    lastName: string;
    dob: string;
    class: string;
    score: number;
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface GenerateResponse {
    message: string;
    count: number;
    timeInMillis: number;
}

export interface ProcessResponse {
    message: string;
    timeInMillis: number;
}

export interface UploadResponse {
    message: string;
    recordsInserted: number;
    timeInMillis: number;
}

export interface PerformanceLog {
    taskName: string;
    timeInMinutes: number;
    timestamp: Date;
}

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/students`;

    // Performance tracking signals
    performanceLogs = signal<PerformanceLog[]>([]);

    // Loading states
    isGenerating = signal(false);
    isProcessing = signal(false);
    isUploading = signal(false);
    isLoadingReport = signal(false);

    // Last operation times
    lastGenerateTime = signal<number | null>(null);
    lastProcessTime = signal<number | null>(null);
    lastUploadTime = signal<number | null>(null);

    private handleError(operation: string) {
        return (error: any) => {
            console.error(`${operation} failed:`, error);
            return throwError(() => new Error(error.error?.message || `${operation} failed. Please try again.`));
        };
    }

    private addPerformanceLog(taskName: string, timeInMillis: number) {
        const log: PerformanceLog = {
            taskName,
            timeInMinutes: timeInMillis / 60000,
            timestamp: new Date()
        };
        this.performanceLogs.update(logs => [...logs, log]);
    }

    generateData(count: number): Observable<GenerateResponse> {
        this.isGenerating.set(true);
        return this.http.post<GenerateResponse>(`${this.baseUrl}/generate?count=${count}`, {}).pipe(
            catchError(this.handleError('Data generation'))
        );
    }

    processFile(file: File): Observable<ProcessResponse> {
        this.isProcessing.set(true);
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ProcessResponse>(`${this.baseUrl}/process`, formData).pipe(
            catchError(this.handleError('File processing'))
        );
    }

    // Process and download CSV
    processFileWithDownload(file: File): Observable<Blob> {
        this.isProcessing.set(true);
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.baseUrl}/process`, formData, { 
            responseType: 'blob' 
        }).pipe(
            catchError(this.handleError('File processing'))
        );
    }

    uploadCsv(file: File): Observable<UploadResponse> {
        this.isUploading.set(true);
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, formData).pipe(
            catchError(this.handleError('CSV upload'))
        );
    }

    getReport(params: {
        page?: number;
        size?: number;
        studentId?: string;
        studentClass?: string;
    }): Observable<PagedResponse<Student>> {
        this.isLoadingReport.set(true);
        let httpParams = new HttpParams()
            .set('page', (params.page || 0).toString())
            .set('size', (params.size || 10).toString());

        if (params.studentId) {
            httpParams = httpParams.set('id', params.studentId);
        }
        if (params.studentClass) {
            httpParams = httpParams.set('class', params.studentClass);
        }

        return this.http.get<PagedResponse<Student>>(`${this.baseUrl}/report`, { params: httpParams }).pipe(
            catchError(this.handleError('Report loading'))
        );
    }

    exportPdf(studentClass?: string): Observable<Blob> {
        let params = new HttpParams();
        if (studentClass) {
            params = params.set('class', studentClass);
        }
        return this.http.get(`${this.baseUrl}/export/pdf`, { params, responseType: 'blob' });
    }

    exportExcel(studentClass?: string): Observable<Blob> {
        let params = new HttpParams();
        if (studentClass) {
            params = params.set('class', studentClass);
        }
        return this.http.get(`${this.baseUrl}/export/excel`, { params, responseType: 'blob' });
    }

    exportCsv(studentClass?: string): Observable<Blob> {
        let params = new HttpParams();
        if (studentClass) {
            params = params.set('class', studentClass);
        }
        return this.http.get(`${this.baseUrl}/export/csv`, { params, responseType: 'blob' });
    }

    clearPerformanceLogs() {
        this.performanceLogs.set([]);
    }
}
