import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class PerenualService {
  private http = inject(HttpClient);
  private env = inject(EnvironmentService);
  private apiUrl = `${this.env.apiUrl}/perenual`;
  private readonly TIMEOUT = 8000; // 8 segundos para API externa

  // Obtener lista de especies
  getSpeciesList(page: number = 1, query?: string): Observable<any> {
    let url = `${this.apiUrl}/species?page=${page}`;
    if (query) {
      url += `&query=${query}`;
    }
    return this.http.get<any>(url).pipe(
      timeout(this.TIMEOUT),
      retry(1), // Reintentar 1 vez automáticamente
      catchError(err => {
        console.error('Error en PerenualService.getSpeciesList:', err);
        return throwError(() => new Error('Error al cargar especies. Verifica tu conexión.'));
      })
    );
  }

  // Obtener detalles de una especie
  getSpeciesDetails(speciesId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/species/${speciesId}`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('Error en PerenualService.getSpeciesDetails:', err);
        return throwError(() => new Error('Error al cargar detalles de la especie.'));
      })
    );
  }

  // Buscar plantas
  searchPlants(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${searchTerm}`).pipe(
      timeout(this.TIMEOUT),
      retry(1),
      catchError(err => {
        console.error('Error en PerenualService.searchPlants:', err);
        return throwError(() => new Error('Error en la búsqueda. Intenta de nuevo.'));
      })
    );
  }

  // Obtener guía de cuidados
  getCareGuides(speciesId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/care/${speciesId}`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('Error en PerenualService.getCareGuides:', err);
        return throwError(() => new Error('Error al cargar guía de cuidados.'));
      })
    );
  }

  // Obtener plagas y enfermedades
  getPestsDiseases(page: number = 1, query?: string): Observable<any> {
    let url = `${this.apiUrl}/pests?page=${page}`;
    if (query) {
      url += `&query=${query}`;
    }
    return this.http.get<any>(url).pipe(
      timeout(this.TIMEOUT),
      retry(1),
      catchError(err => {
        console.error('Error en PerenualService.getPestsDiseases:', err);
        return throwError(() => new Error('Error al cargar plagas y enfermedades.'));
      })
    );
  }

  // Obtener detalles de plaga/enfermedad
  getPestDiseaseDetails(pestId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pests/${pestId}`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('Error en PerenualService.getPestDiseaseDetails:', err);
        return throwError(() => new Error('Error al cargar detalles.'));
      })
    );
  }

  // Obtener plantas de interior
  getIndoorPlants(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/indoor?page=${page}`).pipe(
      timeout(this.TIMEOUT),
      retry(1),
      catchError(err => {
        console.error('Error en PerenualService.getIndoorPlants:', err);
        return throwError(() => new Error('Error al cargar plantas de interior.'));
      })
    );
  }

  // Obtener plantas de exterior
  getOutdoorPlants(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/outdoor?page=${page}`).pipe(
      timeout(this.TIMEOUT),
      retry(1),
      catchError(err => {
        console.error('Error en PerenualService.getOutdoorPlants:', err);
        return throwError(() => new Error('Error al cargar plantas de exterior.'));
      })
    );
  }

  // Obtener plantas seguras (no tóxicas)
  getSafePlants(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/safe?page=${page}`).pipe(
      timeout(this.TIMEOUT),
      retry(1),
      catchError(err => {
        console.error('Error en PerenualService.getSafePlants:', err);
        return throwError(() => new Error('Error al cargar plantas seguras.'));
      })
    );
  }

  // Obtener plantas tóxicas
  getToxicPlants(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/toxic?page=${page}`).pipe(
      timeout(this.TIMEOUT),
      retry(1),
      catchError(err => {
        console.error('Error en PerenualService.getToxicPlants:', err);
        return throwError(() => new Error('Error al cargar plantas tóxicas.'));
      })
    );
  }
}
