import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DiseasesService } from '../../services/diseases.service';
import { Disease } from '../../models/disease.model';

@Component({
  selector: 'app-disease-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="disease-detail-container">
      <div class="loading" *ngIf="loading">Cargando...</div>
      <div class="error" *ngIf="error">{{ error }}</div>

      <div *ngIf="disease && !loading" class="disease-detail">
        <a routerLink="/diseases" class="back-link">← Volver a enfermedades</a>

        <div class="disease-header">
          <span class="disease-type-badge" [class]="disease.type">
            {{ diseaseTypeText(disease.type) }}
          </span>
          <h1>{{ disease.name }}</h1>
        </div>

        <div class="disease-image" *ngIf="disease.imageUrl" 
             [style.background-image]="'url(' + disease.imageUrl + ')'">
        </div>

        <div class="content-section">
          <h2>📋 Descripción</h2>
          <p class="description">{{ disease.description }}</p>
        </div>

        <div class="content-section symptoms-section">
          <h2>🔍 Síntomas</h2>
          <ul class="symptoms-list">
            <li *ngFor="let symptom of disease.symptoms">
              <span class="check">✓</span>
              {{ symptom }}
            </li>
          </ul>
        </div>

        <div class="content-section treatment-section">
          <h2>💊 Tratamiento</h2>
          <div class="treatment-box">
            <p>{{ disease.treatment }}</p>
          </div>
        </div>

        <div class="content-section prevention-section">
          <h2>🛡️ Prevención</h2>
          <div class="prevention-box">
            <p>{{ disease.prevention }}</p>
          </div>
        </div>

        <div class="alert-box">
          <h3>⚠️ Importante</h3>
          <p>
            Es fundamental actuar rápido al detectar síntomas. Un diagnóstico temprano puede
            salvar tu planta y evitar que la enfermedad se propague a otras plantas cercanas.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .disease-detail-container {
      max-width: 900px;
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

    .disease-header {
      margin-bottom: 2rem;
    }

    .disease-type-badge {
      display: inline-block;
      padding: 0.5rem 1.25rem;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1rem;
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

    .disease-header h1 {
      font-size: 2.5rem;
      color: #2d5016;
    }

    .disease-image {
      height: 400px;
      background-size: cover;
      background-position: center;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .content-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .content-section h2 {
      color: #2d5016;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .description {
      color: #555;
      line-height: 1.8;
      font-size: 1.1rem;
    }

    .symptoms-section {
      background: #fff8f0;
      border-left: 4px solid #ff9800;
    }

    .symptoms-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .symptoms-list li {
      padding: 0.75rem 0;
      color: #555;
      font-size: 1.05rem;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .symptoms-list li:last-child {
      border-bottom: none;
    }

    .check {
      color: #ff9800;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .treatment-section {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;
    }

    .treatment-box p {
      color: #2e7d32;
      line-height: 1.8;
      font-size: 1.05rem;
      margin: 0;
    }

    .prevention-section {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .prevention-box p {
      color: #1565c0;
      line-height: 1.8;
      font-size: 1.05rem;
      margin: 0;
    }

    .alert-box {
      background: #fff3e0;
      border: 2px solid #ff9800;
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 2rem;
    }

    .alert-box h3 {
      color: #e65100;
      margin-bottom: 0.75rem;
    }

    .alert-box p {
      color: #555;
      line-height: 1.6;
      margin: 0;
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
      .disease-header h1 {
        font-size: 2rem;
      }

      .disease-image {
        height: 250px;
      }
    }
  `]
})
export class DiseaseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private diseasesService = inject(DiseasesService);
  private cdr = inject(ChangeDetectorRef);
  
  disease: Disease | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log('🔵 DiseaseDetailComponent: Loading disease', id);
      this.loadDisease(id);
    }
  }

  loadDisease(id: string) {
    this.diseasesService.getById(id).subscribe({
      next: (disease) => {
        console.log('✅ DiseaseDetailComponent: Received disease data');
        this.disease = disease;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('🔵 Change detection triggered');
      },
      error: (err) => {
        console.error('🔴 DiseaseDetailComponent: Error:', err);
        this.error = 'Error al cargar la enfermedad';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
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
}
