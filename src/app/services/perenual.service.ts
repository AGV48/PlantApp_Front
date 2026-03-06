import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EnvironmentService } from './environment.service';

export interface PerenualPlant {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  cycle: string;
  watering: string;
  sunlight: string[];
  default_image: {
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  } | null;
}

export interface PerenualResponse {
  data: PerenualPlant[];
  to: number;
  per_page: number;
  current_page: number;
  from: number;
  last_page: number;
  total: number;
}

export interface PerenualPlantDetail {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  family: string;
  origin: string[];
  type: string;
  cycle: string;
  watering: string;
  watering_period: string;
  sunlight: string[];
  maintenance: string;
  care_level: string;
  growth_rate: string;
  drought_tolerant: boolean;
  indoor: boolean;
  description: string;
  default_image: {
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  } | null;
  hardiness: {
    min: string;
    max: string;
  };
}

// Interfaz unificada para plantas (locales y externas)
export interface UnifiedPlant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
  category: string;
  careLevel: 'easy' | 'medium' | 'hard';
  wateringFrequency: string;
  sunlightRequirement: string;
  temperature: string;
  commonDiseases?: string[];
  source: 'local' | 'external';
  externalId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerenualService {
  private http = inject(HttpClient);
  private env = inject(EnvironmentService);
  private apiUrl = `${this.env.apiUrl}/plants`;
  private readonly TIMEOUT = 30000;

  /**
   * Obtiene lista de plantas externas de Perenual
   */
  getExternalPlants(page: number = 1, perPage: number = 30): Observable<PerenualResponse> {
    console.log(`🔵 PerenualService: Fetching external plants (page ${page})`);
    return this.http.get<PerenualResponse>(`${this.apiUrl}/external/list`, {
      params: { page: page.toString(), per_page: perPage.toString() }
    }).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error fetching external plants:', err);
        return throwError(() => new Error('No se pudieron cargar las plantas externas.'));
      })
    );
  }

  /**
   * Busca plantas externas por nombre
   */
  searchExternalPlants(query: string, page: number = 1): Observable<PerenualResponse> {
    console.log(`🔍 PerenualService: Searching "${query}"`);
    return this.http.get<PerenualResponse>(`${this.apiUrl}/external/search`, {
      params: { q: query, page: page.toString() }
    }).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error searching external plants:', err);
        return throwError(() => new Error('No se pudieron buscar plantas.'));
      })
    );
  }

  /**
   * Obtiene detalles de una planta externa
   */
  getExternalPlantDetails(id: number): Observable<PerenualPlantDetail> {
    console.log(`🔵 PerenualService: Fetching details for plant ${id}`);
    return this.http.get<PerenualPlantDetail>(`${this.apiUrl}/external/${id}`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error fetching plant details:', err);
        return throwError(() => new Error('No se pudieron cargar los detalles.'));
      })
    );
  }

  /**
   * Obtiene guía de cuidados de una planta externa
   */
  getExternalPlantCare(id: number): Observable<any> {
    console.log(`📖 PerenualService: Fetching care guide for plant ${id}`);
    return this.http.get<any>(`${this.apiUrl}/external/${id}/care`).pipe(
      timeout(this.TIMEOUT),
      catchError(err => {
        console.error('🔴 Error fetching care guide:', err);
        return throwError(() => new Error('No se pudo cargar la guía de cuidados.'));
      })
    );
  }

  /**
   * Convierte planta de Perenual a formato unificado
   */
  convertToUnifiedPlant(plant: PerenualPlant): UnifiedPlant {
    return {
      id: `external-${plant.id}`,
      externalId: plant.id,
      name: plant.common_name || 'Planta sin nombre',
      scientificName: plant.scientific_name?.[0] || 'N/A',
      description: `${plant.cycle || 'Ciclo desconocido'}. ${plant.other_name?.length ? 'También conocida como: ' + plant.other_name.slice(0, 2).join(', ') : ''}`,
      imageUrl: plant.default_image?.regular_url || plant.default_image?.medium_url || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
      category: 'Externa',
      careLevel: this.mapCareLevel(plant.watering),
      wateringFrequency: this.mapWatering(plant.watering),
      sunlightRequirement: plant.sunlight?.join(', ') || 'No especificado',
      temperature: 'Consultar detalles',
      source: 'external'
    };
  }

  /**
   * Convierte detalles de planta externa a formato unificado
   */
  convertDetailToUnifiedPlant(detail: PerenualPlantDetail): UnifiedPlant {
    return {
      id: `external-${detail.id}`,
      externalId: detail.id,
      name: detail.common_name || 'Planta sin nombre',
      scientificName: detail.scientific_name?.[0] || 'N/A',
      description: detail.description || `${detail.type || 'Planta'}. ${detail.cycle || ''}.`,
      imageUrl: detail.default_image?.regular_url || detail.default_image?.medium_url || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800',
      category: detail.indoor ? 'Interior' : 'Exterior',
      careLevel: this.mapCareLevelFromDetail(detail.care_level, detail.maintenance),
      wateringFrequency: detail.watering_period || this.mapWatering(detail.watering),
      sunlightRequirement: detail.sunlight?.join(', ') || 'No especificado',
      temperature: detail.hardiness ? `${detail.hardiness.min}-${detail.hardiness.max}°F` : 'No especificado',
      source: 'external'
    };
  }

  private mapWatering(watering: string): string {
    const mapping: { [key: string]: string } = {
      'frequent': 'Cada 2-3 días',
      'average': 'Cada 5-7 días',
      'minimum': 'Cada 14-21 días',
      'none': 'Muy poco riego'
    };
    return mapping[watering?.toLowerCase()] || watering || 'No especificado';
  }

  private mapCareLevel(watering: string): 'easy' | 'medium' | 'hard' {
    if (!watering) return 'medium';
    const level = watering.toLowerCase();
    if (level.includes('minimum') || level.includes('none')) return 'easy';
    if (level.includes('frequent')) return 'hard';
    return 'medium';
  }

  private mapCareLevelFromDetail(careLevel: string, maintenance: string): 'easy' | 'medium' | 'hard' {
    const level = careLevel?.toLowerCase() || maintenance?.toLowerCase() || '';
    if (level.includes('low') || level.includes('easy')) return 'easy';
    if (level.includes('high') || level.includes('difficult')) return 'hard';
    return 'medium';
  }
}
