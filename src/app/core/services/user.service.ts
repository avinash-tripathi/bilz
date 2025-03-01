import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../models/auth.models';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`/api/login`);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user).pipe(
            catchError((err) => {
              return throwError(err);    //Rethrow it back to component
            })
          );
    }
    ExcelData(data,Filename){
      this.download(data,Filename)
    }
      download(data,Filename){
        const readyToExport = data
    
        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(readyToExport);
    
        XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
        XLSX.writeFile(workBook, Filename+'.xlsx'); // initiate a file download in browser
    
      }

      getRole(distributioncode:string){
        try{
          const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', '*')
            .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
            .append('Accept', 'application/json');
      
          return this.http.get<Role[]>(`${environment.baseUrl}Role?distributioncode=`+distributioncode 
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
    
      addRole(data: Role): Observable<any> {
    
        try {
          const headers = new HttpHeaders()
            .set('content-type', 'application/json')
            .append('Access-Control-Allow-Origin', '*')
            .append('Access-Control-Allow-Headers', '*')
            .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
            .append('Accept', 'application/json');
            
            const body = JSON.stringify(data);
          return this.http.post<any>(`${environment.baseUrl}Role`,body,
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
    editRole(data: Role): Observable<any> {
    
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', '*')
          .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
          .append('Accept', 'application/json');
          
          const body = JSON.stringify(data);
        return this.http.put<any>(`${environment.baseUrl}Role`,body
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
    
    
    deleteRole(data: Role): Observable<any> {
    
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
          return this.http.delete<any>(`${environment.baseUrl}Role`
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

    ///////////USER

    getUser(distributioncode:string){
      try{
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', '*')
          .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
          .append('Accept', 'application/json');
    
        return this.http.get<User[]>(`${environment.baseUrl}User?distributioncode=`+distributioncode 
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
  
    addUser(data: User): Observable<any> {
  
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', '*')
          .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
          .append('Accept', 'application/json');
          
          const body = JSON.stringify(data);
        return this.http.post<any>(`${environment.baseUrl}User`,body,
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
  editUser(data: User): Observable<any> {
  
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.put<any>(`${environment.baseUrl}User`,body
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
  
  
  resetPassword(data: User): Observable<any> {
  
    try {
      const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
        return this.http.put<any>(`${environment.baseUrl}User/ResetPassword`,body
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
  deleteUser(data: User): Observable<any> {
  
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        const body = JSON.stringify(data);
        return this.http.put<any>(`${environment.baseUrl}User/DeleteUser`,body
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
}
