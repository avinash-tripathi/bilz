import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '../models/auth.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthfakeauthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');
        return this.http.post<any>(`${environment.baseUrl}Login/verifyCredential`,
         { email, password },{ headers: headers }).pipe(
            catchError((err) => {
              return throwError(err);    //Rethrow it back to component
            })
          )
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                //user && user.token
                if (user && user.email) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    //console.log(JSON.stringify(user));
                }
                return user;
            }));
    }
    resetPassword(email: string, password: string, oldpassword: string) {
        const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
        return this.http.put<any>(`${environment.baseUrl}Login/ResetPassword`,
         { email, password,oldpassword },{ headers: headers }).pipe(
            catchError((err) => {
              return throwError(err);    //Rethrow it back to component
            })
          )
            .pipe(map(user => {
                
                return user;
            }));
    }
    

    logout() {
        // remove user from local storage to log user out
        //localStorage.removeItem('currentUser');
        //localStorage.clear();
        sessionStorage.removeItem('currentUser');
        sessionStorage.clear();
        
        this.currentUserSubject.next(null);
    }
}
