import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
// import echarts core
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart} from 'echarts/charts';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { DashboardDetailsComponent } from '@components/dashboard-details/dashboard-details.component';
import { NotFoundComponent } from '@components/not-found/not-found.component';

echarts.use([PieChart, CanvasRenderer, TooltipComponent, LegendComponent]);

@NgModule({
  declarations: [AppComponent, DashboardComponent, DashboardDetailsComponent, NotFoundComponent],
  imports: [NgxEchartsModule.forRoot({echarts }), BrowserModule, AppRoutingModule, MatCardModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
