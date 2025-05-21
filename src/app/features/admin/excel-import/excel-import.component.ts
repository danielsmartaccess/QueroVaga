import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-import.component.html',
  styleUrl: './excel-import.component.scss'
})
export class ExcelImportComponent {
  selectedFile: File | null = null;
  loading = false;
  progress = 0;
  message = '';
  isError = false;
  
  private apiUrl = 'http://localhost:8000/api/import/excel';

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
      
      // Check if the file is Excel
      if (!this.isExcelFile(this.selectedFile)) {
        this.message = 'Por favor, selecione um arquivo Excel (.xlsx ou .xls)';
        this.isError = true;
        this.selectedFile = null;
      } else {
        this.message = '';
        this.isError = false;
      }
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.message = 'Por favor, selecione um arquivo primeiro';
      this.isError = true;
      return;
    }

    this.loading = true;
    this.progress = 0;
    this.message = '';
    this.isError = false;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(
      finalize(() => {
        this.loading = false;
        this.selectedFile = null;
      })
    )
    .subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.message = 'Arquivo importado com sucesso!';
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
        }
      },
      error: (error) => {
        this.isError = true;
        this.message = error.error?.detail || 'Erro ao importar o arquivo.';
        this.progress = 0;
      }
    });
  }

  private isExcelFile(file: File): boolean {
    return file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
  }
}
