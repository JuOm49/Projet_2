import { Component } from '@angular/core';

import { filter, Observable, of, take, tap } from 'rxjs';

import { OlympicService } from '@core/services/olympic.service';
import { Olympic } from '@core/models/Olympic';

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

  constructor(private olympicService: OlympicService) {}
    
  ngOnInit(): void {
    this.getOlympicsInformations();
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
        }
      })
    ).subscribe();
  }
}
