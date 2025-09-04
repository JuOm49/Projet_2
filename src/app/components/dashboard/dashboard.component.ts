import { Component } from '@angular/core';

import { Observable, of } from 'rxjs';

import { OlympicService } from '@core/services/olympic.service';
import { Olympic } from '@core/models/Olympic';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public olympics$: Observable<Olympic[]> = of([]);
    
  constructor(private olympicService: OlympicService) {}
    
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }
}
