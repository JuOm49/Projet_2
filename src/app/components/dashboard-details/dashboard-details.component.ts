import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Observable, take, tap } from 'rxjs';

import { EChartsOption } from 'echarts';

import { Olympic } from '@app/core/models/Olympic';
import { OlympicService } from '@app/core/services/olympic.service';
import { ICountrySummary } from '@components/interfaces/ICountrySummary.interface';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent implements OnInit {

  olympicById$!: Observable<Olympic | null | undefined>;
  lineOlympic!: EChartsOption;
  countrySummary: ICountrySummary = {
    title: '',
    numberOfEntries: 0,
    totalNumberMedals: 0,
    totalNumberAthletes: 0
  };

  private tabYears: number[] = [];
  private seriesData: {value: number, city: string, athletes: number}[] = [];

  readonly labelsForInterface = {
    numberEntriesText: 'Number of entries',
    totalMedalsText: 'Total number medals',
    totalAthletesText: 'Total number of athletes',
    backMedalsPerCountry: 'Back to medals per country'
  };

  constructor(private activatedRoute: ActivatedRoute, private route: Router, private olympicsService: OlympicService) { }

  ngOnInit(): void {
    const countryId: number = +this.activatedRoute.snapshot.params['id'];
    this.olympicById$ = this.olympicsService.getOlympicById(countryId);
    

    this.olympicById$.pipe(
      take(1),
      tap((olympic) => {
        if(!olympic) {
          this.route.navigateByUrl('/not-found');
          return;
        }
        this.getOlympicCountryInformation(olympic);
      }
      )
    ).subscribe();
  }

  getOlympicCountryInformation(olympic: Olympic | null | undefined) {
    if(!olympic) return;

    this.countrySummary.title = olympic?.country;
    this.countrySummary.numberOfEntries = olympic?.participations.length;
    this.countrySummary.totalNumberAthletes = olympic?.participations.flatMap(participation => participation.athleteCount).reduce((acc, count) => acc + count, 0);
    this.countrySummary.totalNumberMedals = olympic?.participations.flatMap(participation => participation.medalsCount).reduce((acc, count) => acc + count, 0);
    for (let participation of olympic?.participations || []) {
          this.tabYears.push(participation.year);
          this.seriesData.push({
            value: participation.medalsCount,
            city: participation.city,
            athletes: participation.athleteCount
          });
        }

    this.lineOlympic = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const param = params[0];
          return `Year : ${param.axisValue}<br>
          Medals : ${param.data.value}<br>
          City : ${param.data.city}<br>
          Athletes: ${param.data.athletes}`;
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
