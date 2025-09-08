import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';

import { Olympic } from '@core/models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  private errorData$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        this.errorData$.next(`Un problème est survenu lors du chargement des données: ${error.message}`);
        this.olympics$.next([]);
        return EMPTY;
      })
    );
  }

  

  getOlympicById(olympicId: number) {
    return this.olympics$.pipe(
      filter(olympics => olympics.length > 0),
      take(1),
      map((olympics) => {
        if(olympics.length !== 0) {
          return olympics.find(olympic => olympic.id === olympicId);
        }
        return null;
      })
    )
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getErrorData() {
    return this.errorData$.asObservable();
  }
}
