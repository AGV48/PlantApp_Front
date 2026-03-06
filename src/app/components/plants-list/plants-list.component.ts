import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlantsService } from '../../services/plants.service';
import { PerenualService } from '../../services/perenual.service';
import { Plant } from '../../models/plant.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-plants-list',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="plants-container">
      <header class="page-header">
        <h1>🌿 Catálogo de Plantas</h1>
        <p>Explora nuestra colección con {{ totalPlantsText }}</p>
      </header>

      <div class="source-selector">
        <button 
          [class.active]="selectedSource === 'local'"
          (click)="selectSource('local')"
          class="source-btn">
          📚 Locales ({{ localCount }})
        </button>
        <button 
          [class.active]="selectedSource === 'external'"
          (click)="selectSource('external')"
          class="source-btn">
          🌍 Base de Datos Global ({{ externalCount }}+)
        </button>
        <button 
          [class.active]="selectedSource === 'all'"
          (click)="selectSource('all')"
          class="source-btn">
          🌎 Todas
        </button>
      </div>

      <div class="filters" *ngIf="selectedSource === 'local'">
        <button 
          [class.active]="selectedCategory === null"
          (click)="filterByCategory(null)"
          class="filter-btn">
          Todas
        </button>
        <button 
          [class.active]="selectedCategory === 'Interior'"
          (click)="filterByCategory('Interior')"
          class="filter-btn">
          Interior
        </button>
        <button 
          [class.active]="selectedCategory === 'Huerto'"
          (click)="filterByCategory('Huerto')"
          class="filter-btn">
          Huerto
        </button>
        <button 
          [class.active]="selectedCategory === 'Suculentas'"
          (click)="filterByCategory('Suculentas')"
          class="filter-btn">
          Suculentas
        </button>
        <button 
          [class.active]="selectedCategory === 'Exterior'"
          (click)="filterByCategory('Exterior')"
          class="filter-btn">
          Exterior
        </button>
      </div>

      <div class="search-bar" *ngIf="selectedSource === 'external'">
        <input 
          type="text" 
          [(ngModel)]="searchQuery"
          (keyup.enter)="searchExternalPlants()"
          placeholder="🔍 Buscar plantas (Ej: rose, tomato, cactus)..."
          class="search-input">
        <button (click)="searchExternalPlants()" class="search-btn">Buscar</button>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner">🌱</div>
        <p>Cargando plantas...</p>
      </div>

      <div class="error" *ngIf="error">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button class="retry-btn" (click)="loadPlants()">🔄 Reintentar</button>
        <div class="help-text" *ngIf="selectedSource === 'external'">
          <p><strong>Nota:</strong></p>
          <ul>
            <li>La API externa requiere una clave válida configurada en el backend</li>
            <li>Límite: 300 solicitudes por día</li>
            <li>Si el servicio no está disponible, usa "Locales" para ver nuestra colección</li>
          </ul>
        </div>
      </div>

      <div class="plants-grid" *ngIf="!loading && !error">
        <div class="plant-card" *ngFor="let plant of plants; trackBy: trackByPlantId">
          <div class="plant-image" [style.background-image]="'url(' + (plant.imageUrl || defaultImage) + ')'">
            <span class="care-level" [class]="plant.careLevel">
              {{ careLevelText(plant.careLevel) }}
            </span>
            <span class="source-badge" [class]="plant.source || 'local'">
              {{ plant.source === 'external' ? '🌍 Externa' : '📚 Local' }}
            </span>
          </div>
          <div class="plant-info">
            <h3>{{ plant.name }}</h3>
            <p class="scientific-name">{{ plant.scientificName }}</p>
            <p class="description">{{ truncateText(plant.description, 120) }}</p>
            
            <div class="plant-details">
              <div class="detail">
                <span class="icon">💧</span>
                <span>{{ plant.wateringFrequency }}</span>
              </div>
              <div class="detail">
                <span class="icon">☀️</span>
                <span>{{ truncateText(plant.sunlightRequirement, 50) }}</span>
              </div>
            </div>

            <a [routerLink]="['/plants', plant.id]" class="view-details">
              {{ plant.source === 'external' ? 'Ver detalles completos →' : 'Ver detalles →' }}
            </a>
          </div>
        </div>
      </div>

      <div class="pagination" *ngIf="!loading && !error && selectedSource === 'external' && totalPages > 1">
        <button 
          (click)="previousPage()" 
          [disabled]="currentPage === 1"
          class="page-btn">
          ← Anterior
        </button>
        <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          (click)="nextPage()" 
          [disabled]="currentPage >= totalPages"
          class="page-btn">
          Siguiente →
        </button>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && plants.length === 0">
        <p>No se encontraron plantas {{ selectedCategory ? 'en esta categoría' : '' }}</p>
        <p *ngIf="selectedSource === 'external'">Intenta con otra búsqueda o selecciona "Locales"</p>
      </div>
    </div>
  `,
  styles: [`
    .plants-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
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

    .source-selector {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .source-btn {
      padding: 1rem 2rem;
      border: 3px solid #4a7c2c;
      background: white;
      color: #4a7c2c;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 700;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .source-btn:hover {
      background: #e8f5e9;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .source-btn.active {
      background: #4a7c2c;
      color: white;
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

    .search-bar {
      max-width: 600px;
      margin: 0 auto 2rem;
      display: flex;
      gap: 1rem;
    }

    .search-input {
      flex: 1;
      padding: 1rem;
      border: 2px solid #4a7c2c;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
    }

    .search-input:focus {
      border-color: #2d5016;
      box-shadow: 0 0 0 3px rgba(74, 124, 44, 0.1);
    }

    .search-btn {
      padding: 1rem 2rem;
      background: #4a7c2c;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .search-btn:hover {
      background: #3a6622;
    }

    .plants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .plant-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .plant-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .plant-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .care-level {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.95);
    }

    .care-level.easy {
      color: #2e7d32;
    }

    .care-level.medium {
      color: #f57c00;
    }

    .care-level.hard {
      color: #c62828;
    }

    .source-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.95);
    }

    .source-badge.local {
      color: #4a7c2c;
    }

    .source-badge.external {
      color: #1976d2;
    }

    .plant-info {
      padding: 1.5rem;
    }

    .plant-info h3 {
      color: #2d5016;
      margin-bottom: 0.25rem;
      font-size: 1.5rem;
    }

    .scientific-name {
      font-style: italic;
      color: #777;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .description {
      color: #555;
      line-height: 1.6;
      margin-bottom: 1rem;
      min-height: 3rem;
    }

    .plant-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #555;
    }

    .icon {
      font-size: 1.2rem;
    }

    .view-details {
      display: inline-block;
      color: #4a7c2c;
      text-decoration: none;
      font-weight: 600;
      margin-top: 1rem;
    }

    .view-details:hover {
      text-decoration: underline;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-top: 3rem;
      padding: 2rem;
    }

    .page-btn {
      padding: 0.75rem 1.5rem;
      background: #4a7c2c;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .page-btn:hover:not(:disabled) {
      background: #3a6622;
      transform: translateY(-2px);
    }

    .page-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .page-info {
      font-weight: 600;
      color: #2d5016;
      font-size: 1.1rem;
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

    .empty-state p {
      margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
      .plants-grid {
        grid-template-columns: 1fr;
      }
      
      .source-selector {
        flex-direction: column;
      }

      .search-bar {
        flex-direction: column;
      }

      .pagination {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class PlantsListComponent implements OnInit {
  private plantsService = inject(PlantsService);
  private perenualService = inject(PerenualService);
  private cdr = inject(ChangeDetectorRef);
  
  plants: Plant[] = [];
  loading = true;
  error: string | null = null;
  selectedCategory: string | null = null;
  selectedSource: 'local' | 'external' | 'all' = 'local';
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  localCount: number = 18;
  externalCount: number = 3000;
  defaultImage: string = 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800';

  get totalPlantsText(): string {
    if (this.selectedSource === 'local') return `${this.localCount} plantas locales`;
    if (this.selectedSource === 'external') return `más de ${this.externalCount.toLocaleString()} plantas`;
    return `${this.localCount} locales + ${this.externalCount.toLocaleString()} externas`;
  }

  ngOnInit() {
    this.loadPlants();
  }

  selectSource(source: 'local' | 'external' | 'all') {
    this.selectedSource = source;
    this.selectedCategory = null;
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadPlants();
  }

  loadPlants() {
    console.log(`🔵 PlantsListComponent: Loading plants, source: ${this.selectedSource}`);
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();
    
    if (this.selectedSource === 'local') {
      this.loadLocalPlants();
    } else if (this.selectedSource === 'external') {
      this.loadExternalPlants();
    } else {
      this.loadAllPlants();
    }
  }

  private loadLocalPlants() {
    this.plantsService.getLocalPlants(this.selectedCategory || undefined).subscribe({
      next: (plants) => {
        console.log('✅ Received local plants:', plants.length);
        this.plants = plants.map(p => ({ ...p, source: 'local' as const }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('🔴 Error loading local plants:', err);
        this.error = 'Error al cargar las plantas locales.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadExternalPlants() {
    const observable = this.searchQuery 
      ? this.perenualService.searchExternalPlants(this.searchQuery, this.currentPage)
      : this.perenualService.getExternalPlants(this.currentPage, 30);

    observable.subscribe({
      next: (response) => {
        console.log('✅ Received external plants:', response.data?.length || 0);
        this.plants = (response.data || []).map(p => 
          this.perenualService.convertToUnifiedPlant(p)
        );
        this.totalPages = response.last_page || 1;
        this.externalCount = response.total || 3000;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('🔴 Error loading external plants:', err);
        this.error = 'No se pudieron cargar las plantas externas. La API podría no estar disponible o la clave no es válida.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadAllPlants() {
    forkJoin({
      local: this.plantsService.getLocalPlants(),
      external: this.perenualService.getExternalPlants(1, 20)
    }).subscribe({
      next: ({ local, external }) => {
        console.log('✅ Received all plants:', local.length, 'local +', external.data?.length || 0, 'external');
        const localPlants = local.map(p => ({ ...p, source: 'local' as const }));
        const externalPlants = (external.data || []).map(p => 
          this.perenualService.convertToUnifiedPlant(p)
        );
        this.plants = [...localPlants, ...externalPlants];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('🔴 Error loading all plants:', err);
        // Si falla, al menos carga las locales
        this.loadLocalPlants();
      }
    });
  }

  searchExternalPlants() {
    if (!this.searchQuery.trim()) {
      this.currentPage = 1;
      this.loadExternalPlants();
      return;
    }
    console.log('🔍 Searching for:', this.searchQuery);
    this.currentPage = 1;
    this.loadExternalPlants();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadExternalPlants();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadExternalPlants();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  filterByCategory(category: string | null) {
    this.selectedCategory = category;
    this.loadPlants();
  }

  careLevelText(level: string): string {
    const levels: any = {
      easy: 'Fácil',
      medium: 'Media',
      hard: 'Difícil'
    };
    return levels[level] || level;
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  trackByPlantId(index: number, plant: Plant): string {
    return plant.id;
  }
}
