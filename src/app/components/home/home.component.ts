import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <section class="hero">
        <h1>🌱 Bienvenido a PlantApp</h1>
        <p class="subtitle">
          Tu guía completa para el cuidado de plantas y diagnóstico de enfermedades
        </p>
        <div class="cta-buttons">
          <a routerLink="/plants" class="btn btn-primary">Explorar Plantas</a>
          <a routerLink="/identify" class="btn btn-secondary">Identificar Planta</a>
        </div>
      </section>

      <section class="features">
        <div class="feature-card">
          <div class="icon">🌿</div>
          <h3>Catálogo de Plantas</h3>
          <p>Descubre diferentes tipos de plantas con información detallada sobre cuidados y necesidades.</p>
          <a routerLink="/plants" class="link">Ver plantas →</a>
        </div>

        <div class="feature-card">
          <div class="icon">🦠</div>
          <h3>Enfermedades</h3>
          <p>Aprende a identificar y tratar enfermedades comunes causadas por hongos, virus y bacterias.</p>
          <a routerLink="/diseases" class="link">Ver enfermedades →</a>
        </div>

        <div class="feature-card">
          <div class="icon">📸</div>
          <h3>Identificación</h3>
          <p>Usa nuestra herramienta de IA para identificar plantas y diagnosticar problemas de salud.</p>
          <a routerLink="/identify" class="link">Identificar ahora →</a>
        </div>
      </section>

      <section class="info-section">
        <h2>¿Qué puedes hacer en PlantApp?</h2>
        <div class="info-grid">
          <div class="info-item">
            <h4>📚 Aprender sobre plantas</h4>
            <p>Información completa sobre cuidados, riego, luz solar y temperatura ideal para cada tipo de planta.</p>
          </div>
          <div class="info-item">
            <h4>🔍 Diagnosticar problemas</h4>
            <p>Identifica enfermedades por hongos, virus, bacterias, plagas o deficiencias nutricionales.</p>
          </div>
          <div class="info-item">
            <h4>💡 Consejos de prevención</h4>
            <p>Aprende cómo prevenir y tratar problemas comunes en tus plantas.</p>
          </div>
          <div class="info-item">
            <h4>🤖 Tecnología IA</h4>
            <p>Utiliza inteligencia artificial para identificar especies y diagnosticar enfermedades con solo una foto.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border-radius: 16px;
      margin-bottom: 3rem;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #2d5016;
    }

    .subtitle {
      font-size: 1.25rem;
      color: #4a7c2c;
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .btn-primary {
      background: #4a7c2c;
      color: white;
    }

    .btn-primary:hover {
      background: #3a6622;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 124, 44, 0.3);
    }

    .btn-secondary {
      background: white;
      color: #4a7c2c;
      border: 2px solid #4a7c2c;
    }

    .btn-secondary:hover {
      background: #4a7c2c;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 124, 44, 0.3);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #2d5016;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .link {
      color: #4a7c2c;
      text-decoration: none;
      font-weight: 600;
    }

    .link:hover {
      text-decoration: underline;
    }

    .info-section {
      background: #f5f5f5;
      padding: 3rem;
      border-radius: 12px;
    }

    .info-section h2 {
      text-align: center;
      color: #2d5016;
      margin-bottom: 2rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .info-item h4 {
      color: #4a7c2c;
      margin-bottom: 0.5rem;
    }

    .info-item p {
      color: #666;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .features {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {}
