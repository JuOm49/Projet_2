import { NgModule } from '@angular/core';
// import echarts core
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { LineChart, PieChart} from 'echarts/charts';

import { ErrorDataComponent } from '@core/components/error-data/error-data.component';

// register the required components
echarts.use([PieChart, CanvasRenderer, TooltipComponent, LineChart, GridComponent]);

@NgModule({
  declarations: [ErrorDataComponent],
  imports: [
    NgxEchartsModule.forRoot({ echarts })
  ],
  exports: [ErrorDataComponent, NgxEchartsModule]
})
export class SharedModule {}