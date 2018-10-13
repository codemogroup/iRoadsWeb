import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Journey } from '../entities/journey';
import { SegmentWrapper } from '../entities/segment-wrapper';

@Injectable()
export class MapService {


    private rootUrl = 'http://iroads.projects.mrt.ac.lk:8080/';
    

    private getJourneyIDsUrl = this.rootUrl + 'getJourneyNames';
    private getLocationDataUrl = this.rootUrl + 'getLocationsByjourneyID?journeyID=';

    private getJourneySegmentsUrl=this.rootUrl+'getJourneySegments?journeyID=';

    // private getPredictedDataUrl ="./../assets/predictedDil.json";
    private getPredictedDataUrl =this.rootUrl+'getPredictionsByGroup?groupID=';
    
    // private getJourneySegmentsDataUrl ="./../assets/JourneySegments.json";

    private getTaggedDataUrl =this.rootUrl+'getAllTags';

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


    getPredictedData(groupId): Observable<Object[]> {
        return this.http.get<Object[]>(this.getPredictedDataUrl+groupId).pipe(
            tap(data => console.log(`predicted data fetched`)),
            catchError(this.handleError('getPredictedData', []))
        );
    }

    // getPredictedDataDemo(groupId): Observable<Object[]> {
    //     return this.http.get<Object[]>("./../assets/getPredictionsByGroup.json").pipe(
    //         tap(data => console.log(`predicted data fetched`)),
    //         catchError(this.handleError('getPredictedData', []))
    //     );
    // }


    getTaggedData():Observable<Object[]> {
        return this.http.get<Object[]>(this.getTaggedDataUrl ).pipe(
            tap(dataItems => console.log(`tagged data fetched`)),
            catchError(this.handleError('getTaggedData', []))
        );
    }

    getJourneySegments(jid,lat,lon):Observable<SegmentWrapper[]> {
        return this.http.get<SegmentWrapper[]>(this.getJourneySegmentsUrl+jid+"&lat="+lat+"&lon="+lon).pipe(
            tap(segmendata => console.log('segment data fetched')),
            catchError(this.handleError('getJourneySegments', []))
        );
    }

    // getJourneySegmentsDummy():Observable<SegmentWrapper> {
    //     return this.http.get<SegmentWrapper>(this.getJourneySegmentsDataUrl+).pipe(
    //         tap(segmendata => console.log('segment data fetched')),
    //         catchError(this.handleError('getJourneySegments', []))
    //     );
    // }


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
