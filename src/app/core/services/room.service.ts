import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Room } from '../models/room';
import { RoomCategory } from '../models/roomcategory';
import { Amenity } from '../models/amenity';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { 
  }
  getAmenities(distributioncode:string){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<Amenity[]>(`${environment.baseUrl}Amenity?distributioncode=`+distributioncode
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

  getRooms(distributioncode:string){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<Room[]>(`${environment.baseUrl}Room?distributioncode=`+distributioncode
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
  getRoomCategory(distributioncode:string){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<RoomCategory[]>(`${environment.baseUrl}RoomCategory?distributioncode=`+distributioncode 
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

  getAvailableRooms(distributioncode:string,fromdate:string,todate:string){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<Room[]>(`${environment.baseUrl}Room/availableRooms?distributioncode=`+distributioncode +'&'+'fromdate='+fromdate+'&'+'todate='+todate
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

  addRoom(data: Room): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}Room`,body,
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
editRoom(data: Room): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.put<any>(`${environment.baseUrl}Room`,body
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


deleteRoom(data: Room): Observable<any> {

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
      return this.http.delete<any>(`${environment.baseUrl}Room`
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
addAmenity(data: Amenity): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.baseUrl}Amenity`,body,
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
editAmenity(data: Amenity): Observable<any> {

try {
  const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .append('Access-Control-Allow-Origin', '*')
    .append('Access-Control-Allow-Headers', '*')
    .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
    .append('Accept', 'application/json');
    
    const body = JSON.stringify(data);
  return this.http.put<any>(`${environment.baseUrl}Amenity`,body
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


deleteAmenity(data: Amenity): Observable<any> {

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
    return this.http.delete<any>(`${environment.baseUrl}Amenity`
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

addRoomCategory(data: RoomCategory): Observable<any> {

  try {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .append('Access-Control-Allow-Origin', '*')
      .append('Access-Control-Allow-Headers', '*')
      .append('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
      .append('Accept', 'application/json');
      
      const body = JSON.stringify(data);
    return this.http.post<any>(`${environment.baseUrl}RoomCategory`,body,
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
editRoomCategory(data: RoomCategory): Observable<any> {

try {
  const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .append('Access-Control-Allow-Origin', '*')
    .append('Access-Control-Allow-Headers', '*')
    .append('Access-Control-Allow-Methods', 'PUT,GET,OPTIONS')
    .append('Accept', 'application/json');
    
    const body = JSON.stringify(data);
  return this.http.put<any>(`${environment.baseUrl}RoomCategory`,body
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


deleteRoomCategory(data: RoomCategory): Observable<any> {

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
    return this.http.delete<any>(`${environment.baseUrl}RoomCategory`
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
