import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Franchise } from 'src/app/core/models/franchise.model';
import { FranchiseToProduct } from '../models/franchisetoproduct';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { 
  }
  

  getProducts(){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<Product[]>(`${environment.baseUrl}Product`
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
  getFranchisetoProducts(){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<FranchiseToProduct[]>(`${environment.baseUrl}Product`
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

  
  getImage(){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<any>(`${environment.baseUrl}Product/GetBase64String`
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

  addImage(obj: any): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(obj);
      return this.http.put<any>(`${environment.baseUrl}Product/UploadImage`,body,
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


   addProduct(data: Product): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}Product`,body,
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
addFranchiseToProduct(data: FranchiseToProduct): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.baseUrl}Franchise/MapProductWithCategory`,body,
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
editProduct(data: Product): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.put<any>(`${environment.baseUrl}Product`,body
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


deleteProduct(data: Product): Observable<any> {

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
      return this.http.delete<any>(`${environment.baseUrl}Product`
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
deleteFranchiseToProduct(data: FranchiseToProduct): Observable<any> {

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
      return this.http.delete<any>(`${environment.baseUrl}Product`
      ,options
    ).pipe(
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
