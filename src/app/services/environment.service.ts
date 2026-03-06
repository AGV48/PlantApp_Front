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

    // En producción, asumir que la API está en el mismo dominio con /api
    if (this.isProduction()) {
      return '/api';
    }

    // En desarrollo, usar localhost
    return 'http://localhost:3000/api';
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' 
        && window.location.hostname !== '127.0.0.1';
  }

  get isProductionEnvironment(): boolean {
    return this.isProduction();
  }
}
