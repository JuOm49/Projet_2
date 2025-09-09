import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDetailsComponent } from './dashboard-details.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { SharedModule } from '@dashboard/shared.module';

const routes: Routes = [
  { path: '', component: DashboardDetailsComponent }
];

@NgModule({
  declarations: [DashboardDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    SharedModule
  ],
})
export class DashboardDetailsModule {}