import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Plant, CreatePlant } from '../models/plant.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {
  private http = inject(HttpClient);
  private env = inject(EnvironmentService);
  private apiUrl = `${this.env.apiUrl}/plants`;
  private readonly TIMEOUT = 30000; // 30 segundos

  getAll(category?: string): Observable<Plant[]> {
    const url = category ? `${this.apiUrl}?category=${category}` : this.apiUrl;
    console.log('🔵 PlantsService: Fetching from', url);
    return this.http.get<Plant[]>(url).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error en PlantsService.getAll:', err);
        console.error('🔴 Error details:', { message: err.message, status: err.status, url });
        return throwError(() => new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'));
      })
    );
  }

  getById(id: string): Observable<Plant> {
    console.log('🔵 PlantsService: Fetching plant', id);
    return this.http.get<Plant>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error en PlantsService.getById:', err);
        return throwError(() => new Error('No se pudo cargar la planta.'));
      })
    );
  }

  create(plant: CreatePlant): Observable<Plant> {
    return this.http.post<Plant>(this.apiUrl, plant).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('Error en PlantsService.create:', err);
        return throwError(() => new Error('No se pudo crear la planta.'));
      })
    );
  }

  update(id: string, plant: Partial<Plant>): Observable<Plant> {
    return this.http.put<Plant>(`${this.apiUrl}/${id}`, plant).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('Error en PlantsService.update:', err);
        return throwError(() => new Error('No se pudo actualizar la planta.'));
      })
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('Error en PlantsService.delete:', err);
        return throwError(() => new Error('No se pudo eliminar la planta.'));
      })
    );
  }

  getPlantDiseases(id: string): Observable<any[]> {
    console.log('🔵 PlantsService: Fetching diseases for plant', id);
    return this.http.get<any[]>(`${this.apiUrl}/${id}/diseases`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error en PlantsService.getPlantDiseases:', err);
        return throwError(() => new Error('No se pudieron cargar las enfermedades.'));
      })
    );
  }

  /**
   * Obtiene solo las plantas locales (base de datos en memoria)
   */
  getLocalPlants(category?: string): Observable<Plant[]> {
    const url = category ? `${this.apiUrl}/local?category=${category}` : `${this.apiUrl}/local`;
    console.log('🔵 PlantsService: Fetching LOCAL plants from', url);
    return this.http.get<Plant[]>(url).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error en PlantsService.getLocalPlants:', err);
        return throwError(() => new Error('No se pudieron cargar las plantas locales.'));
      })
    );
  }

  /**
   * Obtiene plantas de ambas fuentes (local y externa) con un parámetro
   */
  getAllSources(source: 'local' | 'external' | 'all' = 'local'): Observable<any> {
    console.log(`🔵 PlantsService: Fetching plants with source=${source}`);
    return this.http.get<any>(`${this.apiUrl}?source=${source}`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error en PlantsService.getAllSources:', err);
        return throwError(() => new Error('No se pudieron cargar las plantas.'));
      })
    );
  }
}
