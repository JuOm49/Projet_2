import { Component } from '@angular/core';

import { filter, Observable, of, take, tap } from 'rxjs';

import { EChartsOption } from 'echarts';

import { OlympicService } from '@core/services/olympic.service';
import { Olympic } from '@core/models/Olympic';
import { MedalsPerCountry } from '@app/core/models/MedalsPerCountry';

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
  public medalsPerCountry: MedalsPerCountry[] = [];

  pieOption!: EChartsOption;

  constructor(private olympicService: OlympicService) {}
    
  ngOnInit(): void {
    this.getOlympicsInformations();
  }

  onPieClick(event: any): void {
    console.log('Pie chart clicked:', event);
  }

  private getOlympicsInformations(): void {
    this.olympicService.getOlympics().pipe(
      filter(olympics => olympics.length > 0),
      take(1),
      tap((olympics) => {
        if (olympics && olympics.length > 0) {
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
          this.pieOption = {
            tooltip: { trigger: 'item' as const },
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
      })
    ).subscribe();
  }

  private pieDataFromOlympics(olympics: Olympic[]): void {
    this.medalsPerCountry = olympics.map(olympic => {
      return {
        name: olympic.country,
        value: olympic.participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
      };
    });
  }
}
