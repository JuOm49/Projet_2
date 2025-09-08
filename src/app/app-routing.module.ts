import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '@core/not-found/not-found.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { DashboardDetailsComponent } from '@components/dashboard-details/dashboard-details.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'dashboard/:id',
    component: DashboardDetailsComponent,
  },
  {
    path: '',
    component: DashboardComponent,
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
