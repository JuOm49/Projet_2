import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Routes } from '@angular/router';

import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { SharedModule } from '@components/shared.module';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatCardModule,
    SharedModule
]
})
export class DashboardModule {}