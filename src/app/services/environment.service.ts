import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  // La URL se determina automáticamente según el entorno
  readonly apiUrl = this.getApiUrl();

  private getApiUrl(): string {
    // Si está definida en el entorno de build, usarla
    const envApiUrl = (window as any)['API_URL'];
    if (envApiUrl) {
      return envApiUrl;
    }

    // Si está en Docker (detectar por hostname)
    if (this.isDocker()) {
      return 'http://localhost:3000/api';
    }

    // En producción, asumir que la API está en el mismo dominio con /api
    if (this.isProduction()) {
      return '/api';
    }

    // En desarrollo local, usar localhost
    return 'http://localhost:3000/api';
  }

  private isDocker(): boolean {
    // Detectar si está corriendo en Docker
    return window.location.port === '4200' 
        && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' 
        && window.location.hostname !== '127.0.0.1';
  }

  get isProductionEnvironment(): boolean {
    return this.isProduction();
  }
}
