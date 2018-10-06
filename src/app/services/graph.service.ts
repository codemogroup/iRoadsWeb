import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Journey } from '../entities/journey';

@Injectable()
export class GraphService {

    private rootUrl = 'http://iroads.projects.mrt.ac.lk:8080/';
   

    private getJourneyIDsUrl = this.rootUrl + 'getJourneyNames';
    private getGraphDataUrl = this.rootUrl + 'getGraph?journeyID=';

    private graphSplitByValue:number;


    constructor(private http: HttpClient) {
        this.graphSplitByValue=1000;
     }

    getJourneyIDs(): Observable<Journey[]> {
        return this.http.get<Journey[]>(this.getJourneyIDsUrl).pipe(
            tap(dataItems => console.log(`journeyIDs fetched`)),
            catchError(this.handleError('getJourneyIDs', []))
        );
    }

    getGraphData(journeyID): Observable<Object[]> {
        return this.http.get<Object[]>(this.getGraphDataUrl + journeyID+"&splitBy=" + this.graphSplitByValue).pipe(
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
