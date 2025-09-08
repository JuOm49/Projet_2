import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '@core/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('@components/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'dashboard/:id',
    loadChildren: () => import('@components/dashboard-details/dashboard-details.module').then(m => m.DashboardDetailsModule)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**', // wildcard
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
