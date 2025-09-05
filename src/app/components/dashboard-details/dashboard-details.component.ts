import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { filter, Observable, take, tap } from 'rxjs';

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
  public title!: string;
  public numberEntriesText: string = 'Number of entries';
  public totalNumberMedalsText: string = 'Total number medals';
  public totalNumberAtheletesText: string = 'Total number of athletes';
  public numberOfEntries: number = 0;
  public totalNumberMedals: number = 0;
  public totalNumberAthletes: number = 0;

  private tabYears: number[] = [];
  private seriesData: {value: number, city: string}[] = [];

  constructor(private route: ActivatedRoute, private olympicsService: OlympicService) { }

  ngOnInit(): void {
    const countryId: number = +this.route.snapshot.params['id'];
    this.olympicById$ = this.olympicsService.getOlympicById(countryId);
    

    this.olympicById$.pipe(
      filter(olympic => !!olympic),
      take(1),
      tap((olympic) => {
        this.getOlympicCountryInformation(olympic);
      }
      )
    ).subscribe();
  }

  getOlympicCountryInformation(olympic: Olympic | null | undefined) {
    if(!olympic) return;

    this.title = olympic?.country;
    this.numberOfEntries = olympic?.participations.length;
    this.totalNumberAthletes = olympic?.participations.flatMap(participation => participation.athleteCount).reduce((acc, count) => acc + count, 0);
    this.totalNumberMedals = olympic?.participations.flatMap(participation => participation.medalsCount).reduce((acc, count) => acc + count, 0);
    for (let participation of olympic?.participations || []) {
          this.tabYears.push(participation.year);
          this.seriesData.push({
            value: participation.medalsCount,
            city: participation.city
          });
        }

    this.lineOlympic = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const param = params[0];
          return `Year : ${param.axisValue}<br>
          Medals : ${param.data.value}<br>
          City : ${param.data.city}`;
        }
      },
      xAxis: [
        {
          type: 'category',
          data: this.tabYears
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          type: 'line',
          data: this.seriesData
        }
      ]
    };
  }
}
