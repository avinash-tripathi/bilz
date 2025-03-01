import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';
import { HotelChain } from '../models/hotelchain.model';

@Injectable({
    providedIn: 'root'
})
export class ChainService {
    DisplayRegister: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    EditRegister: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    EditOutlet: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    DisplayRegisters: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient, private commonService: CommonService) { }
    AddSalestax(model) {
      return this.http.post(`${environment.baseUrl}Salestax`, model);
  }
  EditSalestax(model) {
      return this.http.put(`${environment.baseUrl}Salestax`, model);
  }
  GetSalestax(obj) {
      const params = new HttpParams().set('storecode', obj.storecode)
      return this.http.get(`${environment.baseUrl}Salestax`, { params });
  }
  
    getOutletAndRegister(obj) {
      if(obj.outletcode){
        var params = new HttpParams().set('storecode', obj.storecode).set('outletcode', obj.outletcode)
      }else{
        var params = new HttpParams().set('storecode', obj.storecode)
      }
        return this.http.get(`${environment.baseUrl}Outlet`, { params });
    }
    AddOutlet(model) {
        return this.http.post(`${environment.baseUrl}Outlet`, model);
    }
    AddRegisterAPI(model) {
        return this.http.post(`${environment.baseUrl}Outlet/AddRegister`, model);
    }
    EditOutletAPI(model) {
        return this.http.put(`${environment.baseUrl}Outlet`, model);
    }
    EditRegisterAPI(model) {
        return this.http.put(`${environment.baseUrl}Outlet/UpdateRegister`, model);
    }
    DeleteOutlet(model) {
        const params = {headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          body: {
            id:JSON.parse(model.id)
          }}
        return this.http.delete(`${environment.baseUrl}Outlet`, params).pipe(catchError(this.commonService.handleError));
    }
    DeleteRegister(model) {
        const params = {headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          body: {
            outletcode:model.outletcode,
            registercode:model.registercode,
            punchedby:model.punchedby
          }}
        return this.http.delete(`${environment.baseUrl}Outlet/DeleteRegisterFromOutlet`, params).pipe(catchError(this.commonService.handleError));
    }
    // Users
    AddUserData(model) {
        return this.http.post(`${environment.baseUrl}Users`, model);
    }
    MapUserToRegister(model) {
      return this.http.post(`${environment.baseUrl}Users/MapUserToRegister`, model);
  }
    UserDataUpdate(model) {
        return this.http.put(`${environment.baseUrl}Users`, model);
    }
    updatePassword(model) {
        return this.http.put(`${environment.baseUrl}Users/ResetPassword`, model);
    }
    // getUserData(obj) {
    //     const params = new HttpParams().set('storecode', obj.storecode)
    //     return this.http.get(`${environment.baseUrl}Users`, { params });
    // }
	getHotelChain(distributioncode : String){
    try{
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS')
        .append('Accept', 'application/json');
  
      return this.http.get<HotelChain[]>(`${environment.baseUrl}HotelChain?`+'distributioncode='+ distributioncode
      ,{ headers: headers });
  
    }
    catch (error) {
      console.error('Here is the error message', error);
    }
  
  }
  addHotelChain(data: HotelChain): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'PUT,POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.post<any>(`${environment.baseUrl}HotelChain`,body,
       { headers: headers }) 
      ;
    }
    catch (error) {
      console.error('Here is the error message', error);
    }
  }

  updateHotelChain(data: HotelChain): Observable<any> {

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', '*')
        .append('Access-Control-Allow-Methods', 'PUT,POST,GET,OPTIONS')
        .append('Accept', 'application/json');
        
        const body = JSON.stringify(data);
      return this.http.put<any>(`${environment.baseUrl}HotelChain`,body,
       { headers: headers }) 
      ;
    }
    catch (error) {
      console.error('Here is the error message', error);
    }
  }
  RemoveOutlet(model) {
    return this.http.put(`${environment.baseUrl}Users/UpdateUserToRegister`, model);
}
SaveStore(model) {
  return this.http.post(`${environment.baseUrl}Storesetup`, model);
}
updateStore(model) {
  return this.http.put(`${environment.baseUrl}Storesetup`, model);
}
deleteChain(data: HotelChain) {
  const params = {headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    body: {
      chaincode:data.chaincode,
      distributioncode:data.distributioncode, 
      
    }}
  return this.http.delete(`${environment.baseUrl}HotelChain`, params).pipe(catchError(this.commonService.handleError));
}
}
