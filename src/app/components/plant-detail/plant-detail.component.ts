import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlantsService } from '../../services/plants.service';
import { Plant } from '../../models/plant.model';
import { Disease } from '../../models/disease.model';

@Component({
  selector: 'app-plant-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="plant-detail-container">
      <div class="loading" *ngIf="loading">Cargando...</div>
      <div class="error" *ngIf="error">{{ error }}</div>

      <div *ngIf="plant && !loading" class="plant-detail">
        <a routerLink="/plants" class="back-link">← Volver a plantas</a>

        <div class="plant-header">
          <div class="plant-image-large" [style.background-image]="'url(' + plant.imageUrl + ')'"></div>
          <div class="plant-main-info">
            <h1>{{ plant.name }}</h1>
            <p class="scientific-name">{{ plant.scientificName }}</p>
            <span class="category-badge">{{ plant.category }}</span>
            <span class="care-badge" [class]="plant.careLevel">
              Nivel de cuidado: {{ careLevelText(plant.careLevel) }}
            </span>
            <p class="description-full">{{ plant.description }}</p>
          </div>
        </div>

        <div class="care-section">
          <h2>🌱 Cuidados</h2>
          <div class="care-grid">
            <div class="care-item">
              <div class="care-icon">💧</div>
              <div class="care-content">
                <h3>Riego</h3>
                <p>{{ plant.wateringFrequency }}</p>
              </div>
            </div>
            <div class="care-item">
              <div class="care-icon">☀️</div>
              <div class="care-content">
                <h3>Luz Solar</h3>
                <p>{{ plant.sunlightRequirement }}</p>
              </div>
            </div>
            <div class="care-item">
              <div class="care-icon">🌡️</div>
              <div class="care-content">
                <h3>Temperatura</h3>
                <p>{{ plant.temperature }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="diseases-section" *ngIf="diseases.length > 0">
          <h2>🦠 Enfermedades Comunes</h2>
          <div class="diseases-grid">
            <div class="disease-card" *ngFor="let disease of diseases">
              <div class="disease-type" [class]="disease.type">
                {{ diseaseTypeText(disease.type) }}
              </div>
              <h3>{{ disease.name }}</h3>
              <p>{{ disease.description }}</p>
              <a [routerLink]="['/diseases', disease.id]" class="learn-more">
                Aprender más →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plant-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .back-link {
      display: inline-block;
      color: #4a7c2c;
      text-decoration: none;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .plant-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .plant-image-large {
      height: 400px;
      background-size: cover;
      background-position: center;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .plant-main-info h1 {
      font-size: 2.5rem;
      color: #2d5016;
      margin-bottom: 0.5rem;
    }

    .scientific-name {
      font-style: italic;
      color: #777;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      display: block;
    }

    .category-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: #e8f5e9;
      color: #2d5016;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-right: 0.5rem;
    }

    .care-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .care-badge.easy {
      background: #c8e6c9;
      color: #1b5e20;
    }

    .care-badge.medium {
      background: #ffe0b2;
      color: #e65100;
    }

    .care-badge.hard {
      background: #ffcdd2;
      color: #b71c1c;
    }

    .description-full {
      margin-top: 1.5rem;
      line-height: 1.8;
      color: #555;
      font-size: 1.1rem;
    }

    .care-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 3rem;
    }

    .care-section h2 {
      color: #2d5016;
      margin-bottom: 1.5rem;
    }

    .care-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .care-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .care-icon {
      font-size: 2.5rem;
    }

    .care-content h3 {
      color: #2d5016;
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .care-content p {
      color: #666;
    }

    .diseases-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .diseases-section h2 {
      color: #2d5016;
      margin-bottom: 1.5rem;
    }

    .diseases-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .disease-card {
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #4a7c2c;
    }

    .disease-type {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .disease-type.fungal {
      background: #ffe0b2;
      color: #e65100;
    }

    .disease-type.bacterial {
      background: #f8bbd0;
      color: #880e4f;
    }

    .disease-type.viral {
      background: #e1bee7;
      color: #4a148c;
    }

    .disease-type.pest {
      background: #ffccbc;
      color: #bf360c;
    }

    .disease-type.deficiency {
      background: #c5cae9;
      color: #1a237e;
    }

    .disease-card h3 {
      color: #2d5016;
      margin-bottom: 0.5rem;
    }

    .disease-card p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .learn-more {
      color: #4a7c2c;
      text-decoration: none;
      font-weight: 600;
    }

    .learn-more:hover {
      text-decoration: underline;
    }

    .loading, .error {
      text-align: center;
      padding: 3rem;
      font-size: 1.1rem;
    }

    .error {
      color: #c62828;
    }

    @media (max-width: 768px) {
      .plant-header {
        grid-template-columns: 1fr;
      }

      .plant-image-large {
        height: 300px;
      }

      .plant-main-info h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class PlantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private plantsService = inject(PlantsService);
  private cdr = inject(ChangeDetectorRef);
  
  plant: Plant | null = null;
  diseases: Disease[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log('🔵 PlantDetailComponent: Loading plant', id);
      this.loadPlant(id);
      this.loadDiseases(id);
    }
  }

  loadPlant(id: string) {
    this.plantsService.getById(id).subscribe({
      next: (plant) => {
        console.log('✅ PlantDetailComponent: Received plant data');
        this.plant = plant;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('🔵 Change detection triggered');
      },
      error: (err) => {
        console.error('🔴 PlantDetailComponent: Error loading plant:', err);
        this.error = 'Error al cargar la planta';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  loadDiseases(id: string) {
    this.plantsService.getPlantDiseases(id).subscribe({
      next: (diseases) => {
        console.log('✅ PlantDetailComponent: Received diseases:', diseases.length);
        this.diseases = diseases;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('🔴 PlantDetailComponent: Error loading diseases:', err);
      }
    });
  }

  careLevelText(level: string): string {
    const levels: any = {
      easy: 'Fácil',
      medium: 'Media',
      hard: 'Difícil'
    };
    return levels[level] || level;
  }

  diseaseTypeText(type: string): string {
    const types: any = {
      fungal: 'Hongo',
      bacterial: 'Bacteria',
      viral: 'Virus',
      pest: 'Plaga',
      deficiency: 'Deficiencia'
    };
    return types[type] || type;
  }
}
