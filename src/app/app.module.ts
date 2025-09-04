import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { DashboardDetailsComponent } from '@components/dashboard-details/dashboard-details.component';
import { HomeComponent } from '@components/home/home.component';
import { NotFoundComponent } from '@components/not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, DashboardComponent, DashboardDetailsComponent, NotFoundComponent],
  imports: [CommonModule, BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
