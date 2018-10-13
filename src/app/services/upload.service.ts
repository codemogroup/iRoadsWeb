import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

@Injectable()
export class UploadService {

  private rootUrl = 'http://iroads.projects.mrt.ac.lk:8080/';
  // private rootUrl = 'http://localhost:8080/';
  private uploadPredictionData = this.rootUrl + 'uploadPredicted';

  private predictionGroupsUrl = this.rootUrl + "getPredictionGroups"

  constructor(private http: HttpClient) { }


  pushFileToServer(file: File, predictionGroup: string, subName: string) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('predictionGroup', predictionGroup);
    formdata.append('subName', subName)

    console.log(formdata);
    const req = new HttpRequest('POST', this.uploadPredictionData, formdata, {
      reportProgress: true,
      responseType: 'text'
    }
    );
    return this.http.request(req).pipe(
      tap(() => console.log('Uploading response..')),
      catchError(this.handleError('pushFileToServer', []))
    );
  }


  getGroups(): Observable<Object[]> {
    return this.http.get<Object[]>(this.predictionGroupsUrl).pipe(
      tap(() => console.log(`prediction groups fetched`)),
      catchError(this.handleError('getGroups', []))
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
