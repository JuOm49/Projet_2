import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { EChartsOption } from 'echarts';

import { Olympic } from '@app/core/models/Olympic';
import { OlympicService } from '@app/core/services/olympic.service';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent implements OnInit {

  olympicById$!: Observable<Olympic | null | undefined>;
  public lineOlympic!: EChartsOption;

  constructor(private route: ActivatedRoute, private olympicsService: OlympicService) { }

  ngOnInit(): void {
    const countryId: number = +this.route.snapshot.params['id'];
    this.olympicById$ = this.olympicsService.getOlympicById(countryId);

    // this.olympicById$.pipe(
    //   tap((data) => console.log('Country data from service:', data))
    // ).subscribe();
  }

}
