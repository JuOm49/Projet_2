import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-data',
  templateUrl: './error-data.component.html',
  styleUrl: './error-data.component.scss'
})
export class ErrorDataComponent {
  @Input() hasError: boolean = false;

  readonly labelsForInterface = {
    NO_DATA: 'No Data available, Please contact the administrator for assistance.',
    OTHER_ISSUE: 'An unexpected error occurred, Please contact the administrator for assistance.'
  }

}
