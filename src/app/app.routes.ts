import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlantsListComponent } from './components/plants-list/plants-list.component';
import { PlantDetailComponent } from './components/plant-detail/plant-detail.component';
import { DiseasesListComponent } from './components/diseases-list/diseases-list.component';
import { DiseaseDetailComponent } from './components/disease-detail/disease-detail.component';
import { IdentifyComponent } from './components/identify/identify.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'plants', component: PlantsListComponent },
  { path: 'plants/:id', component: PlantDetailComponent },
  { path: 'diseases', component: DiseasesListComponent },
  { path: 'diseases/:id', component: DiseaseDetailComponent },
  { path: 'identify', component: IdentifyComponent },
  { path: '**', redirectTo: '' }
];
