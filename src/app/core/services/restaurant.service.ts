import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../models/response/apiresponse';
import { RestaurantOrder, RestaurantOrderPayment } from '../models/restaurant/order';
import { RestaurantMenu } from '../models/restaurant/restaurantmenu';
import { RestaurantMenuCategory } from '../models/restaurant/restaurantmenucategory';
import { TopSellingMenu } from '../models/restaurant/topsellingmenu';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  parkSaleData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) { }

  getRestaurantMenuCategories(distributioncode:string){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
        
      return this.http.get<RestaurantMenuCategory[]>(`${environment.baseUrl}RestaurantMenuCategory?distributioncode=`+distributioncode
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

  getRestaurantMenus(distributioncode:string){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
        //this.http.get<Booking[]>(`${environment.baseUrl}Booking?bookingcode=`+bookingcode+`&distributioncode=`+distributioncode+`&fromdate=` +fromdate+`&todate=` +todate+`&filtervalue=` +filtervalue
      return this.http.get<RestaurantMenu[]>(`${environment.baseUrl}RestaurantMenu?distributioncode=`+distributioncode
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
    getTopSellingMenus(distributioncode:string){
      try{
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', '*')
          .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
          .append('Accept', 'application/json');
          //this.http.get<Booking[]>(`${environment.baseUrl}Booking?bookingcode=`+bookingcode+`&distributioncode=`+distributioncode+`&fromdate=` +fromdate+`&todate=` +todate+`&filtervalue=` +filtervalue
        return this.http.get<TopSellingMenu[]>(`${environment.baseUrl}RestaurantMenu/GetTopSellingMenus?distributioncode=`+distributioncode
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

    addRestaurantMenuCategory(data: RestaurantMenuCategory): Observable<APIResponse<RestaurantMenuCategory>> {

      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', '*')
          .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
          .append('Accept', 'application/json');
          
          const body = JSON.stringify(data);
        return this.http.post<APIResponse<RestaurantMenuCategory>>(`${environment.baseUrl}Restaurantmenucategory`,body,
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
  updateRestaurantMenuCategory(data: RestaurantMenuCategory): Observable<APIResponse<RestaurantMenuCategory>> {
  
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.put<APIResponse<RestaurantMenuCategory>>(`${environment.baseUrl}Restaurantmenucategory`,body,
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

  
   addRestaurantMenu(data: RestaurantMenu): Observable<APIResponse<RestaurantMenu>> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.post<APIResponse<RestaurantMenu>>(`${environment.baseUrl}RestaurantMenu`,body,
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
updateRestaurantMenu(data: RestaurantMenu): Observable<APIResponse<RestaurantMenu>> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.put<APIResponse<RestaurantMenu>>(`${environment.baseUrl}RestaurantMenu`,body,
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

addOrder(data: RestaurantOrder): Observable<APIResponse<RestaurantOrder>> {
  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');

    const body = JSON.stringify(data);

    return this.http.post<APIResponse<RestaurantOrder>>(
      `${environment.baseUrl}RestaurantOrder`,
      body,
      { headers: headers }
    ).pipe(
      catchError((err) => {
        return throwError(() => err); // Ensure proper RxJS 7+ error handling
      })
    );
  } catch (error) {
    console.error('Here is the error message', error);
    return throwError(() => new Error('Unexpected error occurred')); // Handle errors properly
  }
}
updateOrder(data: RestaurantOrderPayment): Observable<APIResponse<RestaurantOrderPayment>> {
  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');

    const body = JSON.stringify(data);

    return this.http.put<APIResponse<RestaurantOrderPayment>>(
      `${environment.baseUrl}RestaurantOrder`,
      body,
      { headers: headers }
    ).pipe(
      catchError((err) => {
        return throwError(() => err); // Ensure proper RxJS 7+ error handling
      })
    );
  } catch (error) {
    console.error('Here is the error message', error);
    return throwError(() => new Error('Unexpected error occurred')); // Handle errors properly
  }
}
getRestaurantOrder(distributioncode:string, fromdate:string, todate:string, referencecode:string){
  try{
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
      //this.http.get<Booking[]>(`${environment.baseUrl}Booking?bookingcode=`+bookingcode+`&distributioncode=`+distributioncode+`&fromdate=` +fromdate+`&todate=` +todate+`&filtervalue=` +filtervalue
    return this.http.get<RestaurantOrder>(`${environment.baseUrl}RestaurantOrder?distributioncode=`+distributioncode+`&fromdate=` +fromdate+`&todate=` +todate+`&referencecode=` +referencecode
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


}
