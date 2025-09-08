import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-data',
  templateUrl: './error-data.component.html',
  styleUrl: './error-data.component.scss'
})
export class ErrorDataComponent {
  @Input() errorMsg: string | null = null;

  noData: string = 'No data available';

}
