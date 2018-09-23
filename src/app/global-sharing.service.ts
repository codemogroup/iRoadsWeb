import { Injectable, Directive  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Journey } from './journey';

@Injectable()
export class GlobalSharingService {

  private rootUrl = 'http://iroads.projects.mrt.ac.lk:8080/';
  private getJourneyIDsUrl = this.rootUrl + 'getJourneyNames';

  private journeyIDs: Journey[];

  public updatingIDs: boolean;

  constructor(private http: HttpClient) {
    this.updatingIDs=false;
    this.journeyIDs=null;
   }

  isIDsUpdating(){
    return this.updatingIDs;
  }
  
  getStoredJourneyIDs(){
    return this.journeyIDs;
  }

  setJourneyIDs(jids){
    this.getJourneyIDs=jids;
  }

  getJourneyIDs(): Observable<Journey[]> {
    this.updatingIDs=true;
    return this.http.get<Journey[]>(this.getJourneyIDsUrl).pipe(
        tap(dataItems => console.log(`journeyIDs fetched`)),
        tap(dataItems => this.updatingIDs=false),
        catchError(this.handleError('getJourneyIDs', []))
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
