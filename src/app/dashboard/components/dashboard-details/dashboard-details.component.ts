import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Observable, Subscription, take, tap } from 'rxjs';

import { EChartsOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';

import { Olympic } from '@core/models/Olympic';
import { OlympicService } from '@core/services/olympic.service';
import { ICountrySummary } from '@dashboard/interfaces/ICountrySummary.interface';

// type for the tooltip data
type medalData = { value: number; city: string; athletes: number };

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrl: './dashboard-details.component.scss'
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {

  // for display country details
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
    backMedalsPerCountry: 'Back to medals per country',
    dates: 'Dates'
  };

  private olympicById$!: Observable<Olympic | null | undefined>;
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
    this.setErrorSubscription();
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
    if(!olympic){
      this.errorMsg = 'No Olympic data found for this country.';
      return;
    } 

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
        formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
          if (Array.isArray(params)) {
            return params.map(param => {
              const data = param.data as medalData;
              return `<div>${param.name} <br/>
                Medals : ${data.value}<br/>
                City : ${data.city}<br/>
                Athletes: ${data.athletes}</div>`;
              }).join('');
          }
          const data = (params as CallbackDataParams).data as medalData;
          return `Medals : ${data.value}<br>
                  City : ${data.city}<br>
                  Athletes: ${data.athletes}`;
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

  private setErrorSubscription(): void {
    this.errorSubscription = this.olympicsService.getErrorData().subscribe(error => {
      if (error) {
        this.errorMsg = error;
      }
    });
  }
}
