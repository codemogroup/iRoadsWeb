import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { SummaryObj } from '../entities/summary-obj';

@Injectable()
export class DashboardService {


  private rootUrl = 'http://iroads.projects.mrt.ac.lk:8080/';

  private getSummaryUrl=this.rootUrl+'getSummary'

  constructor(private http: HttpClient) { }


  getSummary():Observable<SummaryObj> {
    return this.http.get<SummaryObj>(this.getSummaryUrl).pipe(
        tap(dataItems => console.log(`summary fetched`)),
        catchError(this.handleError('getSummary', []))
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
