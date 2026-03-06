import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DiseasesService } from '../../services/diseases.service';
import { Disease } from '../../models/disease.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-diseases-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="diseases-container">
      <header class="page-header">
        <h1>🦠 Enfermedades de Plantas</h1>
        <p>Aprende a identificar, prevenir y tratar enfermedades comunes</p>
      </header>

      <div class="filters">
        <button 
          [class.active]="selectedType === null"
          (click)="filterByType(null)"
          class="filter-btn">
          Todas
        </button>
        <button 
          [class.active]="selectedType === 'fungal'"
          (click)="filterByType('fungal')"
          class="filter-btn">
          Hongos
        </button>
        <button 
          [class.active]="selectedType === 'bacterial'"
          (click)="filterByType('bacterial')"
          class="filter-btn">
          Bacterias
        </button>
        <button 
          [class.active]="selectedType === 'viral'"
          (click)="filterByType('viral')"
          class="filter-btn">
          Virus
        </button>
        <button 
          [class.active]="selectedType === 'pest'"
          (click)="filterByType('pest')"
          class="filter-btn">
          Plagas
        </button>
        <button 
          [class.active]="selectedType === 'deficiency'"
          (click)="filterByType('deficiency')"
          class="filter-btn">
          Deficiencias
        </button>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner">🌱</div>
        <p>Cargando enfermedades...</p>
      </div>

      <div class="error" *ngIf="error">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button class="retry-btn" (click)="loadDiseases()">🔄 Reintentar</button>
        <div class="help-text">
          <p><strong>Posibles soluciones:</strong></p>
          <ul>
            <li>Verifica que el backend esté corriendo en <code>http://localhost:3000</code></li>
            <li>Ejecuta <code>npm run start:dev</code> en la carpeta plant-app_back</li>
            <li>Revisa la consola del navegador para más detalles (F12)</li>
          </ul>
        </div>
      </div>

      <div class="diseases-grid" *ngIf="!loading && !error">
        <div class="disease-card" *ngFor="let disease of diseases; trackBy: trackByDiseaseId">
          <div class="disease-header">
            <span class="disease-type-badge" [class]="disease.type">
              {{ diseaseTypeText(disease.type) }}
            </span>
            <h3>{{ disease.name }}</h3>
          </div>
          
          <p class="description">{{ disease.description }}</p>
          
          <div class="symptoms">
            <h4>Síntomas:</h4>
            <ul>
              <li *ngFor="let symptom of disease.symptoms">{{ symptom }}</li>
            </ul>
          </div>

          <div class="treatment-preview">
            <h4>💊 Tratamiento:</h4>
            <p>{{ disease.treatment }}</p>
          </div>

          <a [routerLink]="['/diseases', disease.id]" class="view-details">
            Ver detalles completos →
          </a>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && diseases.length === 0">
        <p>No se encontraron enfermedades en esta categoría</p>
      </div>
    </div>
  `,
  styles: [`
    .diseases-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      color: #2d5016;
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      border: 2px solid #4a7c2c;
      background: white;
      color: #4a7c2c;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .filter-btn:hover {
      background: #e8f5e9;
    }

    .filter-btn.active {
      background: #4a7c2c;
      color: white;
    }

    .diseases-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .disease-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .disease-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .disease-header {
      margin-bottom: 1rem;
    }

    .disease-type-badge {
      display: inline-block;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .disease-type-badge.fungal {
      background: #ffe0b2;
      color: #e65100;
    }

    .disease-type-badge.bacterial {
      background: #f8bbd0;
      color: #880e4f;
    }

    .disease-type-badge.viral {
      background: #e1bee7;
      color: #4a148c;
    }

    .disease-type-badge.pest {
      background: #ffccbc;
      color: #bf360c;
    }

    .disease-type-badge.deficiency {
      background: #c5cae9;
      color: #1a237e;
    }

    .disease-header h3 {
      color: #2d5016;
      font-size: 1.5rem;
      margin-top: 0.5rem;
    }

    .description {
      color: #555;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .symptoms {
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .symptoms h4 {
      color: #2d5016;
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }

    .symptoms ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .symptoms li {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .treatment-preview {
      background: #e8f5e9;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .treatment-preview h4 {
      color: #2d5016;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .treatment-preview p {
      color: #555;
      line-height: 1.6;
      margin: 0;
    }

    .view-details {
      display: inline-block;
      color: #4a7c2c;
      text-decoration: none;
      font-weight: 600;
    }

    .view-details:hover {
      text-decoration: underline;
    }

    .loading, .error {
      text-align: center;
      padding: 2rem;
      font-size: 1.1rem;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      font-size: 3rem;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .error {
      background: #ffebee;
      border: 2px solid #ef5350;
      border-radius: 12px;
      padding: 2rem;
      color: #c62828;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .retry-btn {
      margin-top: 1rem;
      padding: 0.75rem 2rem;
      background: #4a7c2c;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }

    .retry-btn:hover {
      background: #3a6622;
    }

    .help-text {
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      text-align: left;
    }

    .help-text strong {
      color: #2d5016;
    }

    .help-text ul {
      margin: 0.5rem 0 0 1rem;
      padding: 0;
    }

    .help-text li {
      margin: 0.5rem 0;
      color: #555;
    }

    .help-text code {
      background: #f5f5f5;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #c62828;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .diseases-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DiseasesListComponent implements OnInit {
  private diseasesService = inject(DiseasesService);
  private cdr = inject(ChangeDetectorRef);
  
  diseases: Disease[] = [];
  loading = true;
  error: string | null = null;
  selectedType: string | null = null;

  ngOnInit() {
    this.loadDiseases();
  }

  loadDiseases() {
    console.log('🔵 DiseasesListComponent: Loading diseases, type:', this.selectedType);
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    this.diseasesService.getAll(this.selectedType || undefined).subscribe({
      next: (diseases) => {
        console.log('✅ DiseasesListComponent: Received diseases:', diseases.length);
        this.diseases = diseases;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('🔵 Change detection triggered');
      },
      error: (err) => {
        console.error('🔴 DiseasesListComponent: Error loading diseases:', err);
        this.error = 'Error al cargar las enfermedades. Por favor, intenta de nuevo.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  filterByType(type: string | null) {
    this.selectedType = type;
    this.loadDiseases();
  }

  diseaseTypeText(type: string): string {
    const types: any = {
      fungal: '🍄 Hongo',
      bacterial: '🦠 Bacteria',
      viral: '🧬 Virus',
      pest: '🐛 Plaga',
      deficiency: '⚠️ Deficiencia'
    };
    return types[type] || type;
  }

  trackByDiseaseId(index: number, disease: Disease): string {
    return disease.id;
  }
}
