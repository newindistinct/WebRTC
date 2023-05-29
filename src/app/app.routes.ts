import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'webcam',
    pathMatch: 'full',
  },
  {
    path: 'webcam',
    loadComponent: () => import('./webcam/webcam.page').then( m => m.WebcamPage)
  },
];
