import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@components/home/home.component';
import { NotFoundComponent } from '@components/not-found/not-found.component';
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
    component: HomeComponent,
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
