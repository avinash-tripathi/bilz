import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { Franchise } from 'src/app/core/models/franchise.model';
import { FranchiseToProduct } from '../models/franchisetoproduct';
import { FranchiseCategory } from '../models/franchisecategory';
import { Ledger } from '../models/ledger';
import { Product } from '../models/product';
import { Purchase } from '../models/purchase.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { State } from '../models/state';
import { StateCity } from '../models/statecity';


@Injectable({
  providedIn: 'root'
})
export class FranchiseService {

  constructor(private http: HttpClient) {
  }

  _window(): any {
    return window;
  }

  getStates() {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<State[]>(`${environment.baseUrl}Franchise/GetState`
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }
  getCities() {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<StateCity[]>(`${environment.baseUrl}Franchise/GetCity`
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }

  getFranchises(franchisecode: string) {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<Franchise[]>(`${environment.baseUrl}Franchise/readFranchise?franchisecode=` + franchisecode
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }
  getAllProductWithFranchiseCategory(franchiseCategory: string) {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<FranchiseToProduct[]>(`${environment.baseUrl}Franchise/GetAllProductWithFranchiseCategory?franchisecategory=` + franchiseCategory
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }
  getProductMapWithFranchiseCategory(franchiseCategory: string) {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<Product[]>(`${environment.baseUrl}Franchise/GetProductMapWithFranchiseCategory?franchisecategory=` + franchiseCategory
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }

  getLedger(franchisecode: string) {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<Ledger[]>(`${environment.baseUrl}Franchise/getLedger?franchisecode=` + franchisecode
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }
  getCurrentBalance(franchisecode: string) {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<string>(`${environment.baseUrl}Franchise/getBalance?franchisecode=` + franchisecode
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }
  getFranchiseCategoryCode() {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<FranchiseCategory[]>(`${environment.baseUrl}Franchise/readFranchiseCategoryCode`
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }

  readProductMapWithFranchiseCategory() {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<FranchiseToProduct[]>(`${environment.baseUrl}Franchise/readFranchiseCategoryProducts`
        , { headers: headers }).pipe(
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
      return this.http.post<any>(`${environment.baseUrl}FileUpload`, body,
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


  readPurchase(franchisecode: string, zipstatus: string) {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<Purchase[]>(`${environment.baseUrl}Franchise/GetPurchase?franchisecode=${franchisecode}&zipstatus=${zipstatus} `
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }
  readFranchiseCategory() {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');

      return this.http.get<FranchiseCategory[]>(`${environment.baseUrl}Franchise/getFranchiseCategory`
        , { headers: headers }).pipe(
          catchError((err) => {
            return throwError(err);    //Rethrow it back to component
          })
        );

    }
    catch (error) {
      console.error('Here is the error message', error);
    }

  }

  addFranchiseCategory(data: FranchiseCategory): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');

      const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}Franchise/AddFranchiseCategory`, body,
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
  updateFranchiseCategory(data: FranchiseCategory): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');

      const body = JSON.stringify(data);
      return this.http.put<any>(`${environment.baseUrl}Franchise/UpdateFranchiseCategory`, body,
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

  addPurchase(data: Purchase[]): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');

      const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}Franchise/Purchase`, body,
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

  adminReplyOnFile(data: Purchase): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');

      const body = JSON.stringify(data);
      return this.http.put<any>(`${environment.baseUrl}Franchise/ReplyOnFile`, body,
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


  addFranchise(data: Franchise): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');

      const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}Franchise`, body,
        { headers: headers })
        .pipe(
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

  editFranchise(data: Franchise): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'PUT,POST,GET,OPTIONS')
        .append('Accept', 'application/json');

      const body = JSON.stringify(data);
      return this.http.put<any>(`${environment.baseUrl}Franchise`, body,
        { headers: headers })
        .pipe(
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


  deleteFranchise(data: Franchise): Observable<any> {

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
      return this.http.delete<any>(`${environment.baseUrl}Franchise`
        , options
      ).pipe(
        catchError((err) => {
          return throwError(err);    //Rethrow it back to component
        })
      );
      ;
    }
    catch (error) {
      console.error('Here is the error message', error);
    }
  }


}
