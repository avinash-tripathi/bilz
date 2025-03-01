import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Booking } from 'src/app/core/models/booking';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-detailreport',
  templateUrl: './detailreport.component.html',
  styleUrls: ['./detailreport.component.scss']
})
export class DetailreportComponent implements OnInit {
// bread crumb items
breadCrumbItems: Array<{}>;
userData: String[] = [];
formData: FormGroup;
submitted = false;
_readytoupload = false;
currentpage: number=1;
pageSize:number=50;
bookingData: Booking[] = [];
_selectedBooking : Booking;

model: NgbDateStruct;
term: any;
_alphabetPattern="^[a-zA-Z ]*$";
filterArray =[{code:'active',value:'Active'},{code:'del',value:'Deleted'}]
defaultSelectedValue = 'active' ;

constructor(private modalService: NgbModal,private userService: UserProfileService,private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthenticationService
    , private calendar: NgbCalendar,private spinner: NgxSpinnerService,
    private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'REPORT' }, { label: 'DETAIL REPORT', active: true }];
    this.formData = this.formBuilder.group({
      fromdate: ['', [Validators.required,]],
      todate: ['', [Validators.required,]],
      filtervalue: ['', [Validators.required,]]
      
    });
    if (this.authService.currentUser() != null) {
      this.userData = this.authService.currentUser();
      
    }
    this.formData.controls['fromdate'].setValue(this.calendar.getToday());
    this.formData.controls['todate'].setValue(this.calendar.getNext(this.calendar.getToday(),'m',1) );
    
   
    this._fetchData();
  }
  selectToday() {
    this.model = this.calendar.getToday();
  }
  get f() { return this.formData.controls; }
  openInvoiceModal(content: any,obj:Booking) {
    this._selectedBooking = obj;
   
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  
  _fetchData() {
    try {
      this.spinner.show();
      var f = this.formData.get('fromdate').value;
      var t = this.formData.get('todate').value;
      var filtervalue = this.formData.get('filtervalue').value;

     var fromdate =  this.datePipe.transform( f, 'yyyy-MM-dd');
     var todate =  this.datePipe.transform( t, 'yyyy-MM-dd');
      this.bookingService.getBooking('',this.userData['distributioncode'],fromdate,todate,filtervalue)
        .subscribe(data => {
          this.spinner.hide();
          this.bookingData = null;
          this.bookingData = data;
        })
    }
    catch (error) {
      this.spinner.hide();
      console.log('error while fetching customer record ', error);
    }
    finally{
     
    }
  }

  searchData(){
    
  }
  Array
  download() {
    this.Array=[]
    this.bookingData .forEach(element => {
      var Obj = {}
      Obj['bookingcode'] = element.bookingcode;
      Obj['Invoice No'] = element.invoiceno;
      Obj['Booking Date'] = new DatePipe('en-US').transform(element.bookingdatefrom, 'dd-MMM-yyyy');
      Obj['Customer Name'] = element.customername;
      Obj['Customer Id'] = element.customerid;
      Obj['Customer IdValue'] = element.customeridvalue;
      Obj['Customer GSTNo'] = element.customergstnumber;
      Obj['Customer Address'] = element.customeraddress;
      Obj['Booking Amount'] = element.bookingamount;
      Obj['Booking Type'] = element.featuretype;
      Obj['Payment Amount'] = element.payment;
      Obj['Payment Mode'] = element.paymentmode;

      var AllRoom='';
      element.rooms?.map(obj=>{  AllRoom = AllRoom +',' +  obj.roomname; return AllRoom;});
      Obj['Rooms'] = AllRoom;
      
     this.Array.push(Obj);
    });
     this.userService.ExcelData(this.Array, 'Report');
  }


}
