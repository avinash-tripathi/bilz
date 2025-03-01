
import { Injectable, OnInit } from '@angular/core';
import { HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  constructor() {
  }
  LoginOutlet
  userData: any
  userOutletCode(){
    this.userData = JSON.parse(this.atou(sessionStorage.getItem(environment.dataKey)));
    // console.log(JSON.parse(this.userData[0].registerdetail)[0]);
    
    return  this.LoginOutlet=JSON.parse(this.userData[0].registerdetail)[0].outletcode
  }
  userRegisterCode(){
    this.userData = JSON.parse(this.atou(sessionStorage.getItem(environment.dataKey)));
    return  this.LoginOutlet=JSON.parse(this.userData[0].registerdetail)[0].registercode
  }
  Role(){
    return JSON.parse(this.atou(sessionStorage.getItem(environment.dataKey)))[0].role
  }
  utoa(data) {
    return btoa(unescape(encodeURIComponent(data)));
  }
  atou(data) {
    return decodeURIComponent(escape(atob(data)));
  }
  roundOff(value:Number){
    return Number(value.toFixed(2));
  }
  handleError(error: HttpErrorResponse): Observable<any> {
    let message = null;
    // if (error.error instanceof ErrorEvent) {
    //   this.toastrService.error(`An error occurred: ${error.error.message}`);
    // } else {
    //   this.toastrService.error(`Backend returned code: ${error.status}, body was: ${error.error}`);
    // }
    // return throwError(this.toastrService.error('Something bad happened. Please try again later.'));
    return throwError(null);
  }
  Sweetalert(text,icon) {
    Swal.fire({
      text: text,
      imageHeight: 20,
      confirmButtonColor: '#556ee6',
      timerProgressBar:true,
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      icon: icon,
      position: 'top-right',
    });
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


}


