import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { 
  }
  getBooking(bookingcode:string,distributioncode:string,fromdate:string,todate:string,filtervalue){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<Booking[]>(`${environment.baseUrl}Booking?bookingcode=`+bookingcode+`&distributioncode=`+distributioncode+`&fromdate=` +fromdate+`&todate=` +todate+`&filtervalue=` +filtervalue
      ,{ headers: headers }).pipe(
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      );
  
    }
    catch (error) {
      console.error('Here is the error message', error);
    }
  
  }
  addBooking(data: Booking): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}Booking`,body,
       { headers: headers }).pipe(
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      ) 
      ;
    }
    catch (error) {
      console.error('Here is the error message', error);
    }
}
editBooking(data: Booking): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.put<any>(`${environment.baseUrl}Booking`,body
    ,
    { headers: headers }
    ).pipe(
      catchError((err) => {
        return throwError(err);    //Rethrow it back to component
      })
    ) 
    ;
  }
  catch (error) {
    console.error('Here is the error message', error);
  }
}
updateCheckIn(data: Booking): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.put<any>(`${environment.baseUrl}Booking/UpdateCheckInStatus`,body
    ,
    { headers: headers }
    ).pipe(
      catchError((err) => {
        return throwError(err);    //Rethrow it back to component
      })
    ) 
    ;
  }
  catch (error) {
    console.error('Here is the error message', error);
  }
}
updateCheckOut(data: Booking): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.put<any>(`${environment.baseUrl}Booking/UpdateCheckOutStatus`,body
    ,
    { headers: headers }
    ).pipe(
      catchError((err) => {
        return throwError(err);    //Rethrow it back to component
      })
    ) 
    ;
  }
  catch (error) {
    console.error('Here is the error message', error);
  }
}



deleteBooking(data: Booking): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');
      const body = JSON.stringify(data);
      const options = {
        headers: headers,
        body: body
      };
      return this.http.delete<any>(`${environment.baseUrl}Booking`
      ,options
    ).pipe(
      catchError((err) => {
        return throwError(err);    //Rethrow it back to component
      })
    )
    ;
  }
  catch (error) {
    console.error('Here is the error message', error);
  }
}

  
}
