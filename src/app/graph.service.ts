import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DataItem } from './data-item';
import { window } from 'rxjs/operators/window';

@Injectable()
export class GraphService {

    private rootUrl = 'http://localhost:8080/';
    private rootUrlHeroku = 'https://iroadsrest.herokuapp.com/';

    private getJourneyIDsUrl = this.rootUrlHeroku + 'getJourneyNames';
    private getGraphDataUrl = this.rootUrlHeroku + 'getGraph?journeyID=';


    constructor(private http: HttpClient) { }

    getJourneyIDs(): Observable<Object[]> {
        return this.http.get<Object[]>(this.getJourneyIDsUrl).pipe(
            tap(dataItems => console.log(`journeyIDs fetched`)),
            catchError(this.handleError('getJourneyIDs', []))
        );
    }

    getGraphData(journeyID): Observable<Object[]> {
        return this.http.get<Object[]>(this.getGraphDataUrl + journeyID).pipe(
            tap(dataItems => console.log(`graph data fetched`)),
            catchError(this.handleError('getGraphData', []))
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
