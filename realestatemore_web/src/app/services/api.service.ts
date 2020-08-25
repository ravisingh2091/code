import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  httpOptions
  constructor(
    private http: HttpClient,
    private router: Router

  ) { }


  getData(url): Observable<any> {

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //   "Authorization":"Bearer "+localStorage.getItem('user_token')
      }),
    }

    return this.http.get<any>(url, this.httpOptions)
      .pipe(
        tap((heroes) => {
          // this.checkStatus(heroes);
        }),
        catchError(this.handleError('get', []))
      );
  }



  postData(url, data): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //   "Authorization":"Bearer "+localStorage.getItem('user_token')
      }),
    }

    return this.http.post<any>(url, data, this.httpOptions)
      .pipe(
        tap(datas => this.checkAuth(datas)),
        catchError(this.handleError('post', []))
      );
  }

  putData(url, data): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //   "Authorization":"Bearer "+localStorage.getItem('user_token')
      }),
    }

    return this.http.put<any>(url, data, this.httpOptions)
      .pipe(
        tap(),
        catchError(this.handleError('post', []))
      );
  }

  formData(url, data): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content': 'multipart/form-data',
        //   "Authorization":"Bearer "+localStorage.getItem('user_token')
      }),
    }
    return this.http.post<any>(url, data, this.httpOptions)
      .pipe(
        tap(),
        catchError(this.handleError('post', []))
      );
  }


  /**
 * Handle Http operation that failed.`
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //   if(error.status ==401){
      //     localStorage.clear();
      //     this.router.navigateByUrl('/login')  
      //   } 

      // log to console instead


      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  log(message: any) {
    // this.messageService.add('HeroService: ' + message);
    console.log(message)
  }
  private checkAuth(data) {
    // if(data.responseCode == 401){
    //   window.location.reload()
    // }
  }
}








