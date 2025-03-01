import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/Customer';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { 
  }
  

  getCustomers(distributioncode:string){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<Customer[]>(`${environment.baseUrl}Customer?distributioncode=` +distributioncode 
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
 
   addCustomer(data: Customer): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}Customer`,body,
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

editCustomer(data: Customer): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.put<any>(`${environment.baseUrl}Customer`,body
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


deleteCustomer(data: Customer): Observable<any> {

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
      return this.http.delete<any>(`${environment.baseUrl}Customer`
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
