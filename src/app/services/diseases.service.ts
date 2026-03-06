import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Disease, CreateDisease } from '../models/disease.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class DiseasesService {
  private http = inject(HttpClient);
  private env = inject(EnvironmentService);
  private apiUrl = `${this.env.apiUrl}/diseases`;
  private readonly TIMEOUT = 30000; // 30 segundos

  getAll(type?: string): Observable<Disease[]> {
    const url = type ? `${this.apiUrl}?type=${type}` : this.apiUrl;
    console.log('🔵 DiseasesService: Fetching from', url);
    return this.http.get<Disease[]>(url).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error en DiseasesService.getAll:', err);
        console.error('🔴 Error details:', { message: err.message, status: err.status, url });
        return throwError(() => new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'));
      })
    );
  }

  getById(id: string): Observable<Disease> {
    console.log('🔵 DiseasesService: Fetching disease', id);
    return this.http.get<Disease>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error en DiseasesService.getById:', err);
        return throwError(() => new Error('No se pudo cargar la enfermedad.'));
      })
    );
  }

  create(disease: CreateDisease): Observable<Disease> {
    return this.http.post<Disease>(this.apiUrl, disease).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('Error en DiseasesService.create:', err);
        return throwError(() => new Error('No se pudo crear la enfermedad.'));
      })
    );
  }
}
