import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Journey } from './journey';

@Injectable()
export class MapService {

  private rootUrl = 'http://iroads.projects.mrt.ac.lk:8080/';
//   private rootUrl = 'http://localhost:8080/';
  private rootUrlHeroku = 'https://iroadsrest.herokuapp.com/';

  private getJourneyIDsUrl = this.rootUrl + 'getJourneyNames';
  private getLocationDataUrl = this.rootUrl + 'getLocationsByjourneyID?journeyID=';


  constructor(private http: HttpClient) { }

  getJourneyIDs(): Observable<Journey[]> {
      return this.http.get<Journey[]>(this.getJourneyIDsUrl).pipe(
          tap(dataItems => console.log(`journeyIDs fetched`)),
          catchError(this.handleError('getJourneyIDs', []))
      );
  }

  getLocationData(journeyID): Observable<Object[]> {
      return this.http.get<Object[]>(this.getLocationDataUrl + journeyID).pipe(
          tap(dataItems => console.log(`location data fetched`)),
          catchError(this.handleError('getLocationData', []))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead

          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${error.message}`);

          // Let the app keep running by returning an empty result.
          return of(result as T);
      };
  }

  log(message: string) {
      alert(message);
  }

}
