import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerenualService } from '../../services/plant-id.service';

@Component({
  selector: 'app-identify',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="identify-container">
      <header class="page-header">
        <h1>🔍 Explorar Base de Datos Real</h1>
        <p>Busca entre miles de especies reales usando Perenual API</p>
      </header>

      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (keyup.enter)="search()"
            placeholder="Buscar plantas (ej: monstera, tomate, rosa...)"
            class="search-input">
          <button (click)="search()" class="search-btn" [disabled]="loading">
            {{ loading ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>

        <div class="quick-filters">
          <button (click)="loadIndoorPlants()" class="filter-btn">🏠 Plantas de Interior</button>
          <button (click)="loadOutdoorPlants()" class="filter-btn">🌳 Plantas de Exterior</button>
          <button (click)="loadSafePlants()" class="filter-btn">✓ Plantas Seguras</button>
          <button (click)="loadPestsDiseases()" class="filter-btn">🦠 Plagas y Enfermedades</button>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner">🌱</div>
        <p>Cargando datos...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{ error }}</p>
      </div>

      <div class="results" *ngIf="!loading && results.length > 0">
        <h2>{{ resultsTitle }}</h2>
        <div class="results-grid">
          <div class="result-card" *ngFor="let item of results">
            <div class="result-image" 
                 [style.background-image]="item.default_image?.thumbnail ? 'url(' + item.default_image.thumbnail + ')' : 'url(https://via.placeholder.com/150?text=No+Image)'">
            </div>
            <div class="result-info">
              <h3>{{ item.common_name || item.scientific_name || item.common_names?.[0] || 'Sin nombre' }}</h3>
              <p class="scientific">{{ item.scientific_name || item.scientific_names?.[0] || '' }}</p>
              <div class="tags" *ngIf="item.cycle || item.watering || item.sunlight?.[0]">
                <span class="tag" *ngIf="item.cycle">{{ item.cycle }}</span>
                <span class="tag" *ngIf="item.watering">💧 {{ item.watering }}</span>
                <span class="tag" *ngIf="item.sunlight?.[0]">☀️ {{ item.sunlight[0] }}</span>
              </div>
              <button (click)="viewDetails(item.id)" class="view-btn" *ngIf="item.id">
                Ver Detalles →
              </button>
            </div>
          </div>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button (click)="previousPage()" [disabled]="currentPage === 1" class="page-btn">
            ← Anterior
          </button>
          <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
          <button (click)="nextPage()" [disabled]="currentPage === totalPages" class="page-btn">
            Siguiente →
          </button>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && !error && searched && results.length === 0">
        <p>No se encontraron resultados. Intenta con otro término de búsqueda.</p>
      </div>

      <div class="api-info">
        <h3>🌟 Usando Perenual API</h3>
        <p>Datos reales de miles de especies de plantas. API completamente gratuita.</p>
        <ul>
          <li>✓ 10,000+ especies de plantas</li>
          <li>✓ Información detallada de cuidados</li>
          <li>✓ Imágenes reales</li>
          <li>✓ Base de datos de plagas y enfermedades</li>
          <li>✓ 300 búsquedas gratis al día</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .identify-container {
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

    .search-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .search-box {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .search-input {
      flex: 1;
      padding: 1rem 1.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #4a7c2c;
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

    .search-btn:hover:not(:disabled) {
      background: #3a6622;
    }

    .search-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .quick-filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      background: #f5f5f5;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .filter-btn:hover {
      background: #e8f5e9;
      border-color: #4a7c2c;
      color: #2d5016;
    }

    .loading {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      font-size: 3rem;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      background: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .results h2 {
      color: #2d5016;
      margin-bottom: 1.5rem;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .result-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .result-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .result-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      background-color: #f5f5f5;
    }

    .result-info {
      padding: 1.25rem;
    }

    .result-info h3 {
      color: #2d5016;
      margin-bottom: 0.25rem;
      font-size: 1.1rem;
    }

    .scientific {
      font-style: italic;
      color: #777;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      background: #e8f5e9;
      color: #2d5016;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .view-btn {
      width: 100%;
      padding: 0.75rem;
      background: #4a7c2c;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s;
    }

    .view-btn:hover {
      background: #3a6622;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-top: 2rem;
    }

    .page-btn {
      padding: 0.75rem 1.5rem;
      background: #4a7c2c;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: #666;
      font-weight: 500;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .api-info {
      background: #e8f5e9;
      padding: 2rem;
      border-radius: 12px;
      margin-top: 3rem;
    }

    .api-info h3 {
      color: #2d5016;
      margin-bottom: 1rem;
    }

    .api-info ul {
      list-style: none;
      padding: 0;
    }

    .api-info li {
      padding: 0.5rem 0;
      color: #555;
    }

    @media (max-width: 768px) {
      .search-box {
        flex-direction: column;
      }

      .results-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class IdentifyComponent implements OnInit {
  private perenualService = inject(PerenualService);

  searchTerm = '';
  results: any[] = [];
  loading = false;
  error: string | null = null;
  searched = false;
  currentPage = 1;
  totalPages = 1;
  resultsTitle = 'Resultados';

  ngOnInit() {
    // Cargar plantas de interior por defecto
    this.loadIndoorPlants();
  }

  search() {
    if (!this.searchTerm.trim()) {
      this.error = 'Por favor ingresa un término de búsqueda';
      return;
    }

    this.loading = true;
    this.error = null;
    this.searched = true;
    this.resultsTitle = `Resultados para "${this.searchTerm}"`;

    this.perenualService.searchPlants(this.searchTerm).subscribe({
      next: (data) => {
        this.results = data.data || [];
        this.currentPage = data.current_page || 1;
        this.totalPages = data.last_page || 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al buscar plantas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadIndoorPlants() {
    this.loading = true;
    this.error = null;
    this.searched = true;
    this.resultsTitle = '🏠 Plantas de Interior';

    this.perenualService.getIndoorPlants(this.currentPage).subscribe({
      next: (data) => {
        this.results = data.data || [];
        this.currentPage = data.current_page || 1;
        this.totalPages = data.last_page || 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar plantas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadOutdoorPlants() {
    this.loading = true;
    this.error = null;
    this.searched = true;
    this.resultsTitle = '🌳 Plantas de Exterior';

    this.perenualService.getOutdoorPlants(this.currentPage).subscribe({
      next: (data) => {
        this.results = data.data || [];
        this.currentPage = data.current_page || 1;
        this.totalPages = data.last_page || 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar plantas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadSafePlants() {
    this.loading = true;
    this.error = null;
    this.searched = true;
    this.resultsTitle = '✓ Plantas Seguras (No Tóxicas)';

    this.perenualService.getSafePlants(this.currentPage).subscribe({
      next: (data) => {
        this.results = data.data || [];
        this.currentPage = data.current_page || 1;
        this.totalPages = data.last_page || 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar plantas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadPestsDiseases() {
    this.loading = true;
    this.error = null;
    this.searched = true;
    this.resultsTitle = '🦠 Plagas y Enfermedades';

    this.perenualService.getPestsDiseases(this.currentPage).subscribe({
      next: (data) => {
        this.results = data.data || [];
        this.currentPage = data.current_page || 1;
        this.totalPages = data.last_page || 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar datos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.reloadCurrentView();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.reloadCurrentView();
    }
  }

  reloadCurrentView() {
    // Recargar la vista actual con la nueva página
    if (this.resultsTitle.includes('Interior')) {
      this.loadIndoorPlants();
    } else if (this.resultsTitle.includes('Exterior')) {
      this.loadOutdoorPlants();
    } else if (this.resultsTitle.includes('Seguras')) {
      this.loadSafePlants();
    } else if (this.resultsTitle.includes('Plagas')) {
      this.loadPestsDiseases();
    } else {
      this.search();
    }
  }

  viewDetails(id: number) {
    // Por ahora mostrar alerta, luego se puede crear una vista detallada
    alert(`Ver detalles de la planta ID: ${id}\n\nPróximamente: Vista detallada con toda la información de Perenual API`);
  }
}
