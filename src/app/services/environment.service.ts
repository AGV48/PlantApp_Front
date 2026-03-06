import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  // La URL se determina automáticamente según el entorno
  readonly apiUrl = this.getApiUrl();

  private getApiUrl(): string {
    // 1. Primero, verificar si hay una variable de entorno definida
    const envApiUrl = (window as any)['API_URL'];
    if (envApiUrl) {
      return envApiUrl;
    }

    // 2. Si está en Docker (detectar por puerto y hostname)
    if (this.isDocker()) {
      return 'http://localhost:3000/api';
    }

    // 3. En producción (Vercel), usar variable de entorno o URL hardcoded
    // TODO: Actualizar esta URL cuando despliegues el backend
    if (this.isProduction()) {
      // Puedes poner aquí la URL de tu backend en Railway/Render
      // Por ejemplo: 'https://tu-backend.railway.app/api'
      return window.location.origin + '/api'; // Cambiar después del deploy del backend
    }

    // 4. En desarrollo local, usar localhost
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

  // Método útil para debugging
  getEnvironmentInfo(): any {
    return {
      apiUrl: this.apiUrl,
      hostname: window.location.hostname,
      port: window.location.port,
      isProduction: this.isProduction(),
      isDocker: this.isDocker(),
    };
  }
}
