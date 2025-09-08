import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Observable, Subscription, take, tap } from 'rxjs';

import { EChartsOption } from 'echarts';

import { Olympic } from '@core/models/Olympic';
import { OlympicService } from '@core/services/olympic.service';
import { ICountrySummary } from '@components/interfaces/ICountrySummary.interface';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {

  // for display country details
  olympicById$!: Observable<Olympic | null | undefined>;
  lineOlympic!: EChartsOption;
  countrySummary: ICountrySummary = {
    title: '',
    numberOfEntries: 0,
    totalNumberMedals: 0,
    totalNumberAthletes: 0
  };
  readonly labelsForInterface = {
    numberEntriesText: 'Number of entries',
    totalMedalsText: 'Total number medals',
    totalAthletesText: 'Total number of athletes',
    backMedalsPerCountry: 'Back to medals per country'
  };

  // for the chart
  //tabYears is used for the abscissa X (xAxis)
  private tabYears: number[] = [];
  //value is the number of medals for the year, it's used for the ordinate Y (yAxis)
  private seriesData: {value: number, city: string, athletes: number}[] = [];

  // for error handling
  private errorSubscription!: Subscription;
  errorMsg: string | null = null;

  constructor(private activatedRoute: ActivatedRoute, private route: Router, private olympicsService: OlympicService) { }

  ngOnInit(): void {
    this.getErrorSubscription();
    this.loadOlympicDetails();
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

  //private methods
  private loadOlympicDetails(): void {
    const countryId: number = +this.activatedRoute.snapshot.params['id'];
    this.olympicById$ = this.olympicsService.getOlympicById(countryId);

    this.olympicById$.pipe(
      take(1),
      tap((olympic) => {
        if (!olympic) {
          this.route.navigateByUrl('/not-found');
          return;
        }
        this.setOlympicCountryInformation(olympic);
      })
    ).subscribe();
  }

  private setOlympicCountryInformation(olympic: Olympic | null | undefined) {
    if(!olympic) return;

    // prepare data for the country summary
    this.countrySummary.title = olympic.country;
    this.countrySummary.numberOfEntries = olympic.participations.length;
    this.countrySummary.totalNumberAthletes = olympic.participations.flatMap(participation => participation.athleteCount).reduce((total, count) => total + count, 0);
    this.countrySummary.totalNumberMedals = olympic.participations.flatMap(participation => participation.medalsCount).reduce((total, count) => total + count, 0);
    
    // prepare data for the line chart
    for (let participation of olympic.participations || []) {
      this.tabYears.push(participation.year);
      this.seriesData.push({
        value: participation.medalsCount,
        city: participation.city,
        athletes: participation.athleteCount
      });
    }

    // define the line chart
    this.lineOlympic = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgb(0, 153, 153)', 
        textStyle: { color: 'white' },
        formatter: (params: any) => {
          const param = params[0];
          return `Medals : ${param.data.value}<br>
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

  private getErrorSubscription(): void {
    this.errorSubscription = this.olympicsService.getErrorData().subscribe(error => {
      if (error) {
        this.errorMsg = error;
      }
    });
  }
}
