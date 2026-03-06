import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          🌱 PlantApp
        </a>
        <ul class="nav-menu">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              Inicio
            </a>
          </li>
          <li>
            <a routerLink="/plants" routerLinkActive="active">
              Plantas
            </a>
          </li>
          <li>
            <a routerLink="/diseases" routerLinkActive="active">
              Enfermedades
            </a>
          </li>
          <li>
            <a routerLink="/identify" routerLinkActive="active">
              Identificar
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%);
      padding: 1rem 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0;
      padding: 0;
    }

    .nav-menu a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .nav-menu a:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-menu a.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-menu {
        gap: 1rem;
      }
    }
  `]
})
export class NavbarComponent {}
