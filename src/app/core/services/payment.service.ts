import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfirmPaymentPayload } from '../models/confirmpaymentpayload';
import { OrderModel } from '../models/ordermodel';
import { Wallet } from '../models/wallet';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { 
  }

  initializePayment(data:OrderModel): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}Payment/initialize`,body,
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
confirmPayment(data:ConfirmPaymentPayload): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.baseUrl}Payment/confirm`,body,
     { headers: headers }) .pipe(
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

walletRecharge(data:Wallet): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.baseUrl}Payment`,body,
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

}
