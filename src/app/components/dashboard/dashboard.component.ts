import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { filter, Observable, of, take, tap } from 'rxjs';

import { EChartsOption } from 'echarts';

import { OlympicService } from '@core/services/olympic.service';
import { Olympic } from '@core/models/Olympic';

import { CountryMedalsSummary } from '@app/core/models/CountryMedalsSummary';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public olympics$: Observable<Olympic[]> = of([]);
  public title: string = 'Medals per Country';
  public numberOfCountriesText: string = 'Number of countries';
  public numberOfJosText: string = 'Number of JOs';
  public numberOfCountries: number = 0;
  public numberOfJos: number = 0;
  public olympics: Olympic[] = [];
  public medalsPerCountry: CountryMedalsSummary[] = [];
  public pieCountryMedalsSummary!: EChartsOption;

  constructor(private olympicService: OlympicService, private route: Router) {}
    
  ngOnInit(): void {
    this.getOlympicsInformations();
  }

  onPieClick(event: any): void {
    this.route.navigateByUrl(`dashboard/${event.data.id}`);
  }

  private getOlympicsInformations(): void {
    this.olympicService.getOlympics().pipe(
      filter(olympics => olympics.length > 0),
      take(1),
      tap((olympics) => {
          this.olympics = olympics;
          //dans olympic.json, chaque itération correspond à un pays
          this.numberOfCountries = olympics.length;
          // calcul le nombre d'années uniques dans lesquelles les JO ont eu lieu à partir de olympic.json
          //flatMap met à plat le tableau des participations pour chaque pays
          const years = olympics.flatMap(
            olympic => olympic.participations.map(
              participation => participation.year));
          // Set permet de ne garder que les années uniques
          this.numberOfJos = new Set(years).size;
          this.pieDataFromOlympics(olympics);

          //medalsPerCountry est un tableau d'objets avec le nom du pays et le nombre de médailles pour affichage dans le graphique
          this.getPieCountriesMedalsSummary();
      })
    ).subscribe();
  }

  private pieDataFromOlympics(olympics: Olympic[]): void {
    this.medalsPerCountry = olympics.map(olympic => {
      return {
        id: olympic.id,
        name: olympic.country,
        value: olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
      };
    });
  }

  private getPieCountriesMedalsSummary(): void {
    this.pieCountryMedalsSummary = {
      tooltip: { 
        trigger: 'item' as const,
        position: function (point) {
                    return [point[0] - 30, point[1] - 80];
                  },
        backgroundColor: 'rgb(0, 153, 153)', 
        textStyle: { color: 'white' },
        formatter: (countryMedalSummary: any) => {
          return `<div>${countryMedalSummary.name} <br/>
          <span class="medal-img-container">
          <img src="assets/img/medal.png" alt="medal"/>
          </span>
           ${countryMedalSummary.value}</div>
          <div class="custom-tooltip-arrow"></div>`;
        }
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            ...this.medalsPerCountry
          ]
        }
      ]
    };
  }
}
