import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Booking } from 'src/app/core/models/booking';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { BookingService } from 'src/app/core/services/booking.service';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { Room } from 'src/app/core/models/room';
import { RoomService } from 'src/app/core/services/room.service';
import { RoomCategory } from 'src/app/core/models/roomcategory';
import { PackageService } from 'src/app/core/services/package.service';
import { Package } from 'src/app/core/models/Package';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { PackageFeature } from 'src/app/core/models/packagefeature';
import { Amenity } from 'src/app/core/models/amenity';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  @ViewChild('invoicecontent', { static: true }) invcontent: TemplateRef<any>;
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  term: any;
  cardTitle = "New Booking";
  valButtonText = "New Booking";
  isNewEntry = true;
  userData: any;
  currentpage: number = 1;
  pageSize: number =25;
  filter
  show = '*';
  _selectedBookingcode:string='';
  bookingData: Booking[];
  packageArray:Package[]=[];
  _selectedBooking : Booking;
  roomArray : Room[] =[];
  featureArray:PackageFeature[]=[];
  formDataCheckIn:FormGroup;
  formDataCheckOut:FormGroup;
  updateBooking:Booking;
  submittedCheckIn = false;
  submittedCheckOut = false;
  arrayAminities: Amenity[] = [];
  customeridArray: {}[] = [{ value: 'PASSPORT' },{ value: 'PANCARD' }, { value: 'AADHAARCARD' }, { value: 'VOTERID' }, { value: 'DRIVING LICENSE' }, { value: 'OTHER' }];
  paymentmodeArray =[{code:'cash',value:'Cash'},{code:'upi',value:'UPI'},{code:'card',value:'Debit/Credit Card'},{code:'net',value:'Net Banking'}]
  validlicense:string = '';
  @ViewChild('contentLicense') contentLicense;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private roomService:RoomService,
    private commonService: CommonService,
    private datePipe:DatePipe, private packageService:PackageService,
    private spinner: NgxSpinnerService,private authService: AuthenticationService,private router: Router,) {
      this.validlicense = this.authService.currentUser()['validlicense'];
  }
  ngAfterViewInit() {
    if (this.validlicense!='valid')
     setTimeout(() => {
       this.openLicenseModal();
     }, 2000);
  }
  openLicenseModal() {
    this.modalService.open(this.contentLicense, { centered: true });
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    if (this.userData.role=='POS'){
      this.router.navigate(['/']);

    }

    this.breadCrumbItems = [{ label: 'PACKAGE BOOKING' }, { label: 'PACKAGE', active: true }];
    this.formDataCheckIn = this.formBuilder.group({
      checkindate: ['',[Validators.required]],
      checkintime: ['',[Validators.required]],
    })
    this.formDataCheckOut = this.formBuilder.group({
      checkoutdate: ['',[Validators.required]],
      checkouttime: ['',[Validators.required]],
      paymentmode: ['',[Validators.required]],
    })

    this.formData = this.formBuilder.group({
      customername: ['', [Validators.required]],
      customerid: ['', [Validators.required]],
      //email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      customergstnumber: ['', [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],
      address: ['', [Validators.required]],
      package: ['', [Validators.required]],
      
      bookingamount: ['0', [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$"),Validators.min(0)]],

      //gstnumber: ['', [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],
      customeridvalue: ['',],
      bookingdatefrom: ['',],
      bookingdateto: ['',],
      discountpercent: ['0', [Validators.min(0),Validators.max(100)]],
      companyname: ['',],
      noofdays: ['1', [Validators.required,Validators.min(1)]],
     
    })
   this.getPackages();
   this._fetchData('');

  }
  get form() {
    return this.formData.controls;
  }
  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map(control => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => next ? prev + next : prev, 0);
  
      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : { required: true };
    };
  
    return validator;
  }
  

  reset() {
    this.isNewEntry=true;
    this.submitted= false;
   this.cardTitle = "New Booking";
  this.valButtonText = "New Booking";
  this.arrayAminities=[];
  this.packageArray = this.packageArray.map((pkg) => {
     pkg.packagefeatures.map((pf) => {
        pf.status = false;
        return pf;
      });
    return pkg;
  });
  
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  openInvoiceModal(content: any,obj:Booking) {
    this._selectedBooking = obj;
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  hideShow(index) {
    if (this.show == index) {
      this.show = '*'
    } else {
      this.show = index;
   
    }
  }
  getAvailableRooms(){
    try {
      const _bookingdatefrom = this.isNewEntry? this.formData.get('bookingdatefrom').value : '01/01/2000';
      const _bookingdateto =  this.isNewEntry? this.formData.get('bookingdateto').value : '01/01/2000';
      if (_bookingdatefrom ==null || _bookingdateto ==null){
          return ;
      }
      this.roomService.getAvailableRooms(this.userData['distributioncode'],_bookingdatefrom,_bookingdateto)
        .subscribe(data => {
          this.roomArray = null;
          this.roomArray = data.map((d)=> {d.status = false; return d;});
        });
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }

  async getDataMeta(bookingcode: string): Promise<Booking> {
    try {
      this.spinner.show();
      return await this.bookingService
        .getBooking(bookingcode, this.userData['distributioncode'], '', '','active')
        .pipe(
          map(data => {
            if (data.length > 0) {
              return data[0];
            }
            throw new Error('Data is empty');
          })
        )
        .toPromise();
    } catch (error) {
      this.spinner.hide();
      throw error;
    } finally {
      this.spinner.hide();
    }
  }
  get formCheckIn() {
    return this.formDataCheckIn.controls;
  }
  get formCheckOut() {
    return this.formDataCheckOut.controls;
  }
  

  dataToEdit(obj:Booking) {
    let objEdit = obj;

    this.cardTitle = "Edit Booking";
    this.valButtonText = "Edit Booking";
    this.isNewEntry = false;
    this._selectedBookingcode = objEdit.bookingcode;
    this.formData.controls['bookingdatefrom'].setValue(this.datePipe.transform(objEdit.bookingdatefrom, 'yyyy-MM-dd'));
    this.formData.controls['bookingdateto'].setValue(this.datePipe.transform(objEdit.bookingdateto, 'yyyy-MM-dd'));
    this.formData.controls['customername'].setValue(objEdit.customername);
    this.formData.controls['phone'].setValue(objEdit.customercontactno);
    this.formData.controls['address'].setValue(objEdit.customeraddress);
    this.formData.controls['customerid'].setValue(objEdit.customerid);
    this.formData.controls['customeridvalue'].setValue(objEdit.customeridvalue);
    this.formData.controls['customergstnumber'].setValue(objEdit.customergstnumber);
    this.formData.controls['bookingamount'].setValue(objEdit.bookingamount);
    this.formData.controls['package'].setValue(objEdit.packagecode);
    this.formData.controls['discountpercent'].setValue(objEdit.discountpercent);
    this.formData.controls['noofdays'].setValue(objEdit.noofdays);
    this.formData.controls['companyname'].setValue(objEdit.companyname);

    this.packageArray = this.packageArray.map((pkg) => {
      if (pkg.packagecode === objEdit.packagecode) {
        pkg.packagefeatures = pkg.packagefeatures.map((pf) => {
          if (pf.featuretype === "Package") {
            objEdit.packageamenities.forEach((am) => {
              if (pf.featurecode === am.amenitycode) {
                pf.amenityrate = am.amenityrate;
                pf.quantity = am.quantity;
                pf.status = true;
              }
            });
          }
          return pf;
        });
      }
      return pkg;
    });
  }

  getPackages(){
    try {
    
      this.packageService.getPackage(this.userData['distributioncode'])
        .subscribe(data => {
          this.packageArray = null;
          this.packageArray = data;
  
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }

  deleteBooking(obj:Booking){
    const _distributioncode = this.userData['distributioncode'];
    const _createdby = this.userData['usercode'];
    obj.createdby = _createdby;
    obj.distributioncode = _distributioncode;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Booking!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Delete it!'
    }).then(result => {
      if (result.value) {
        this.bookingService.deleteBooking(obj).subscribe(returnValue => {
          this.modalService.dismissAll();

          if (returnValue.result.length > 0) {
            Swal.fire('Deleted!', 'YourBooking has been deleted.', 'success');
            var retvalue = '';
            retvalue = returnValue.result;

          } else {
            Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
          }

          this._fetchData('');
          this.submitted = false;
        }, err => {
          Swal.fire('Not Deleted!', err, 'error');
         
        })
      }});
    
  }
  onChange($event){
    const id = $event.target.value;
    const isChecked = $event.target.checked;
    this.packageArray = this.packageArray.map((f)=>{
      if (f.packagecode == this.formData.get('package').value){
        f.packagefeatures.map((pf)=>{
          if (pf.featuretype=='Package' && pf.featurecode ==id  ) {
            pf.status=isChecked;
          }
          return pf;
        })

      }
      return f;
    })
    /* const selectedPackage = this.packageArray.filter((f)=>(f.packagecode == this.formData.get('package').value));
    
    selectedPackage[0].packagefeatures.map((pf)=>{
      if (pf.featuretype=="Package" && pf.featurecode ==id && isChecked ){
        var obj = new Amenity();
        obj.amenitycode = pf.featurecode;
        obj.amenityrate = pf.amenityrate;
        obj.quantity = pf.quantity;
        obj.tax = pf.tax;
        obj.hsncode = pf.hsncode;
        obj.featuretype = pf.featuretype;
        this.arrayAminities.push(obj)
      }
      else if (pf.featuretype=="Package" && pf.featurecode ==id && isChecked ==false){
        const index =   this.arrayAminities.findIndex(item => item.amenitycode === id);

        if (index !== -1) {
          this.arrayAminities.splice(index, 1);
        }

      }
    })  */

  
  }

  openCheckInModal(content: any,data:Booking) {
    this.updateBooking =null;
    this.updateBooking = data;
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
  openCheckOutModal(content: any,data:Booking) {
    this.updateBooking =null;
    this.updateBooking = data;
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  saveCheckIn(){
    var obj = this.updateBooking;
    if (obj==null){
      return;
    }
    if (this.formDataCheckIn.valid) {
      
      const _datefrom =  this.datePipe.transform(obj.bookingdatefrom, 'yyyy-MM-dd') ;
      const _dateto =  this.datePipe.transform(obj.bookingdateto, 'yyyy-MM-dd') ;
      const _checkindate = this.formDataCheckIn.get('checkindate').value;
      const _checkintime= this.formDataCheckIn.get('checkintime').value;
      const _checkinby = this.userData['usercode'];
      //const _checkin = new Date(`${_checkindate}T${_checkintime}`);
     // obj.checkin =  this.datePipe.transform(_checkin,'yyyy-MM-dd hh:mm:ss');
     obj.checkin = _checkindate.toString() +' '+ _checkintime.toString();
      obj.checkinby = _checkinby;
      if(Date.parse(_checkindate)< Date.parse(_datefrom)){
        Swal.fire({
          title:"Invalid Date!",
          text:"Check-In Date can't be less then Booking Date: " + this.datePipe.transform(obj.bookingdatefrom, 'yyyy-MM-dd'),
          icon: 'warning', 
        });
        return;
      }
      if(Date.parse(_checkindate)> Date.parse(_dateto)){
        Swal.fire({
          title:"Invalid Date!",
          text:"Your Booking is expired: Please connect with Hotel Admin!" ,
          icon: 'warning', 
        });
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to Check-In this Booking!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, Save it!'
      }).then(result => {
        if (result.value) {
          this.bookingService.updateCheckIn(obj).subscribe(returnValue => {
            this.modalService.dismissAll();

            if (returnValue.result.length > 0) {
              Swal.fire('Saved!', 'You Checked-In Successfully.', 'success');
              var retvalue = '';
              retvalue = returnValue.result;

            } else {
              Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
            }

            this._fetchData('');
          }, err => {
            Swal.fire('Not Saved!', err, 'error');
            console.log('oops', err)
          })
        }
      });
      
    }
    this.submittedCheckIn=true;
  }
  saveCheckOut(){
    var obj = this.updateBooking;
    if (obj==null){
      return;
    }
    if (this.formDataCheckOut.valid) {
      const _datefrom =  this.datePipe.transform(obj.bookingdatefrom, 'yyyy-MM-dd') ;
      const _dateto =  this.datePipe.transform(obj.bookingdateto, 'yyyy-MM-dd') ;

      const _checkoutdate = this.formDataCheckOut.get('checkoutdate').value;
      const _paymentmode = this.formDataCheckOut.get('paymentmode').value;
      const _checkoutby = this.userData['usercode'];
     
      obj.checkoutby = _checkoutby;
      const _checkouttime= this.formDataCheckOut.get('checkouttime').value;
     
     obj.checkout = _checkoutdate.toString() + ' ' + _checkouttime.toString();
     obj.paymentmode = _paymentmode;

     if(Date.parse(_checkoutdate)< Date.parse(_datefrom))
      {
        Swal.fire({
          title:"Invalid Date!",
          text:"Check-Out Date can't be less then Booking Date: " + this.datePipe.transform(obj.bookingdatefrom, 'yyyy-MM-dd'),
          icon: 'warning', 
        });
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to Check-Out this Booking!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, Save it!'
      }).then(result => {
        if (result.value) {
          this.bookingService.updateCheckOut(obj).subscribe(returnValue => {
            this.modalService.dismissAll();
            if (returnValue.result.length > 0) {
              Swal.fire('Saved!', 'You Checked-Out Successfully.', 'success');
              var retvalue = '';
              retvalue = returnValue.result;
              this.getDataMeta(this.updateBooking.bookingcode).then((objBooking)=>{
                var cont = this.invcontent;
                   this.openInvoiceModal(cont,objBooking);
             });

            } else {
              Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
            }

            this._fetchData('');
          }, err => {
            Swal.fire('Not Saved!', err, 'error');
            console.log('oops', err)
          })
        }
      });
     
    }
    this.submittedCheckOut=true;
  }

  savebooking() {
    
    if (this.formData.valid) {
      //const _Bookingcode = this.formData.get('Bookingcode').value;
      this.arrayAminities=[];
      
      this.packageArray.map((p)=>{
        p.packagefeatures.map((pf)=>{ if (pf.featuretype=="Package" && pf.status ){
          var obj = new Amenity();
          obj.amenitycode = pf.featurecode;
          obj.amenityrate = pf.amenityrate;
          obj.quantity = pf.quantity;
          obj.tax = pf.tax;
          obj.hsncode = pf.hsncode;
          obj.featuretype = pf.featuretype;
          this.arrayAminities.push(obj)
        }});

       
      })
      if (  this.arrayAminities.length<=0){
        Swal.fire({
          title:"Warning",
          text:"Please select at least one Feature: " ,
          icon: 'warning', 
        });
        return;
      
      }

      const _bookingdatefrom = this.formData.get('bookingdatefrom').value;
      const _bookingdateto = this.formData.get('bookingdateto').value;
      const _bookingamount = this.formData.get('bookingamount').value;
      const _customername = this.formData.get('customername').value;
      const _customerid = this.formData.get('customerid').value;
      const _customeridvalue = this.formData.get('customeridvalue').value;
      const _customergstnumber = this.formData.get('customergstnumber').value;
      const _customeraddress = this.formData.get('address').value;
      const _customercontactno = this.formData.get('phone').value;
      const _noofdays = this.formData.get('noofdays').value;
      const _companyname = this.formData.get('companyname').value;
      const _packagecode = this.formData.get('package').value;
      const _discountpercent = this.formData.get('discountpercent').value;
      const _distributioncode = this.userData['distributioncode'];
      const _createdby = this.userData['usercode'];
      
      if(Date.parse(_bookingdateto)< Date.parse(_bookingdatefrom)){
        Swal.fire({
          title:"Invalid Date!",
          text:"Booking date to can't be less then Booking Date from: " + this.datePipe.transform(_bookingdatefrom, 'yyyy-MM-dd'),
          icon: 'warning', 
        });
        return;
      }
      //const selectedPackage = this.packageArray.filter((f)=>(f.packagecode == _packagecode));
      var _roomquantity =0;
      var _roomcategory = '';
      /*  commented out room feature in Package
      selectedPackage[0].packagefeatures.map((pf)=>{
        if (pf.featuretype=="RoomCategory"){
          _roomquantity = pf.amenityrate>0?pf.quantity:0
          
          _roomcategory = pf.featurename;
        }
      }) */
     /*  selectedPackage[0].packagefeatures.map((pf)=>{
        if (pf.featuretype=="Package" && pf.status ){
          var obj = new Amenity();
          obj.amenitycode = pf.featurecode;
          obj.amenityrate = pf.amenityrate;
          obj.tax = pf.tax;
          obj.hsncode = pf.hsncode;
          obj.featuretype = pf.featuretype
          arrayAminities.push(obj)
        }
      })  */
      /* commented out room feature in Package
       const availableRooms = this.roomArray.filter((f)=>f.roomcategoryname == _roomcategory);
      if (availableRooms.length<_roomquantity)
      {
        Swal.fire({
          title:'Rooms not available',
          text: _roomcategory + ' Rooms are not available in selected Dates!',
          icon:'info'
        })
        return ;
      } */
    
      let obj = new Booking();
      obj.bookingdatefrom = _bookingdatefrom;
      obj.bookingdateto = _bookingdateto;
      obj.bookingamount = _bookingamount;
      obj.customeraddress = _customeraddress;
      obj.customerid = _customerid;
      obj.customeridvalue = _customeridvalue;
      obj.customergstnumber = _customergstnumber;
      obj.customername = _customername;
      obj.customercontactno = _customercontactno;
      obj.createdby = _createdby;
      obj.distributioncode = _distributioncode;
      
      //features = this.packageArray.filter(data=> data.packagecode ==_packagecode ).map(v=>  v.packagefeatures);

      
      obj.packagecode = _packagecode;
      obj.packageamenities =this.arrayAminities; 
      obj.discountpercent = _discountpercent;
      obj.noofdays= _noofdays;
      obj.companyname = _companyname;
      obj.rooms=[];
      obj.featuretype='Package';
     

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this Booking!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.bookingService.addBooking(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Booking has been saved.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this._fetchData('');
            }, err => {
              Swal.fire('Not Saved!', err, 'error');
              console.log('oops', err)
            })
          }
        });

      }
      else {
 
    obj.bookingcode =   this._selectedBookingcode ;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this Booking!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this.bookingService.editBooking(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Booking has been Updated.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this._fetchData('');
            }, err => {
              Swal.fire('Not Saved!', err, 'error');
              console.log('oops', err)
            })

          }
        });
      }
    }
   
    this.submitted = true
  }
  _fetchData(bookingcode) {
    try {
      this.spinner.show();
      this.bookingService.getBooking(bookingcode,this.userData['distributioncode'],'','','active')
        .subscribe(data => {
          this.spinner.hide();
          this.bookingData = null;
          this.bookingData = data.filter(obj=> obj.featuretype=='Package');
        })
    }
    catch (error) {
      this.spinner.hide();
      console.log('error while fetching customer record ', error);
    }
    finally{
     
    }
  }
 
  filterAvailableRoom(a){};
}
