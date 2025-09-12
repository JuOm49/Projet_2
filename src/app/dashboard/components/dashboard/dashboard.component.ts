import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { filter, take, tap, Subscription } from 'rxjs';

import { ECElementEvent, EChartsOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';

import { OlympicService } from '@core/services/olympic.service';
import { Olympic } from '@core/models/Olympic';
import { CountryMedalsSummary } from '@core/models/CountryMedalsSummary';
import { IOlympicsStats } from '@dashboard/interfaces/IOlympicsStats.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  pieCountryMedalsSummary!: EChartsOption;
  olympicsStats: IOlympicsStats = { numberOfCountries: 0, numberOfJos: 0 };
  readonly labelsForInterface = {
    title: 'Medals per Country',
    numberOfCountriesText: 'Number of countries',
    numberOfJosText: 'Number of JOs'
  }
  // Data for the pie chart and statistics
  private medalsPerCountry: CountryMedalsSummary[] = [];

  // Subscription for error handling
  errorMsg: string | null = null;
  private errorSubscription$!: Subscription;
  

  constructor(private olympicService: OlympicService, private route: Router) {}
    
  ngOnInit(): void {
    this.setErrorSubscription();
    this.setOlympicsInformations();
  }

  ngOnDestroy(): void {
    this.errorSubscription$.unsubscribe();
  }

  onPieClick(event: ECElementEvent): void {
    if(event.data && event.data !== null && typeof event.data === 'object' && 'id' in event.data){
      this.route.navigateByUrl(`dashboard/${event.data.id}`);
    }   
  }

  // Fetch Olympics data and set statistics and pie chart data
  private setOlympicsInformations(): void {
    this.olympicService.getOlympics().pipe(
      filter(olympics => olympics.length > 0),
      take(1),
      tap((olympics) => {
          //in olympic.json, each iteration corresponds to a country
          this.olympicsStats.numberOfCountries = olympics.length;
          // calculate the number of unique years in which the Olympics took place from olympic.json
          //flatMap flattens the array of participations for each country
          const years = olympics.flatMap(
            olympic => olympic.participations.map(
              participation => participation.year));
          // Set stores only unique values
          this.olympicsStats.numberOfJos = new Set(years).size;
          this.setPieDataFromOlympics(olympics);

          //medalsPerCountry is an array of objects with the country name and the number of medals
          //for display in the chart
          this.setPieCountriesMedalsSummary();
      })
    ).subscribe();
  }

  // Transform the data from the Olympic array to the format needed for the pie chart
  private setPieDataFromOlympics(olympics: Olympic[]): void {
    this.medalsPerCountry = olympics.map(olympic => {
      return {
        id: olympic.id,
        name: olympic.country,
        value: olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
      };
    });
  }

  // Configure the pie chart options and data
  private setPieCountriesMedalsSummary(): void {
    this.pieCountryMedalsSummary = {
      tooltip: { 
        trigger: 'item' as const,
        position: function (point) {
                    return [point[0] - 30, point[1] - 80];
                  },
        backgroundColor: 'rgb(0, 153, 153)', 
        textStyle: { color: 'white' },
        formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
          if (Array.isArray(params)) {
            return params.map(param => `<div>${param.name} <br/>
            <span class="medal-img-container">
            <img src="assets/img/medal.png" alt="medal"/>
            </span>
             ${param.value}</div>`).join('');
          }
          return `<div>${params.name} <br/>
          <span class="medal-img-container">
          <img src="assets/img/medal.png" alt="medal"/>
          </span>
           ${params.value}</div>
          <div class="custom-tooltip-arrow"></div>`;
        }
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            // Use the spread operator to pass each object from medalsPerCountry as a separate element
            // in the data array.
            // Without the spread, data would be a single-element array containing the entire
            // medalsPerCountry array, which is not the expected format for the pie chart.
            ...this.medalsPerCountry
          ]
        }
      ]
    };
  }

  private setErrorSubscription(): void {
    this.errorSubscription$ = this.olympicService.getErrorData().subscribe(error => {
      if (error) {
        this.errorMsg = error;
      }
    });
  }
}
