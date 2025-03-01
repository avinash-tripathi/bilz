import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, ValidatorFn,FormControl  } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';

import { CustomerService } from 'src/app/core/services/customer.service';
import { Customer } from 'src/app/core/models/Customer';



@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  term: any;
  cardTitle = "New customer";
  valButtonText = "New customer";
  isNewEntry = true;
  userData: [];
  currentpage: number = 1;
  pageSize: number = 20;
  filtershow = '*';
  customerArray:Customer[]=[];
  _selectedcustomercode : string;
  
  show = '*';
  customeridArray: {}[] = [{ value: 'PASSPORT' },{ value: 'PANCARD' }, { value: 'AADHAARCARD' }, { value: 'VOTERID' }, { value: 'DRIVING LICENSE' }, { value: 'OTHER' }];
  
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private customerService: CustomerService,
    private commonService: CommonService,
    private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.breadCrumbItems = [{ label: 'CUSTOMER MANAGEMENT'}, { label: 'ADD CUSTOMER', active: true }];
    this.formData = this.formBuilder.group({
      customername: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]],
      customerid: ['', [Validators.required]],
      customeridvalue: ['', [Validators.required]],
      customeraddress1: [''],
      customeraddress2: [''],
      phonenumber:  ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      customergstnumber: ['', [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],
      city: [''],
      state: [''],
      pincode: [''],
      country: ['',[Validators.pattern('^[a-zA-Z ]*$')]],
    });
    this._fetchData();
  }
  hideShow(index) {
    if (this.show == index) {
      this.show = '*'
    } else {
      this.show = index;
   
    }
  }
  get form() {
    return this.formData.controls;
  }
  reset() {
    this.isNewEntry = true;
    this.submitted = false;
    this.cardTitle = "New Customer";
    this.valButtonText = "New Customer";
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  _fetchData() {
    try {
      this.customerService.getCustomers(this.userData['distributioncode'])
        .subscribe(data => {
          this.customerArray = null;
          this.customerArray = data;
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }
  dataToEdit(data:Customer){
    this.isNewEntry = false;
    this.cardTitle = "Edit Customer";
    this.valButtonText = "Edit Customer";
    this._selectedcustomercode = data.customercode;
    this.formData.controls['customername'].setValue(data.customername);
    this.formData.controls['customeraddress1'].setValue(data.customeraddress1);
    this.formData.controls['customeraddress2'].setValue(data.customeraddress2);
    this.formData.controls['phonenumber'].setValue(data.phonenumber);
    this.formData.controls['city'].setValue(data.city);
    this.formData.controls['state'].setValue(data.state);
    this.formData.controls['pincode'].setValue(data.pincode);
    this.formData.controls['country'].setValue(data.country);
    this.formData.controls['customerid'].setValue(data.customerid);
    this.formData.controls['customeridvalue'].setValue(data.customeridvalue);
  
  }
  deleteCustomer(obj:Customer){
    const _distributioncode = this.userData['distributioncode'];
    const _createdby = this.userData['usercode'];
   
    obj.distributioncode = _distributioncode;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Customer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Delete it!'
    }).then(result => {
      if (result.value) {
        this.customerService.deleteCustomer(obj).subscribe(returnValue => {
          this.modalService.dismissAll();

          if (returnValue.result.length > 0) {
            Swal.fire('Deleted!', 'Your Customer has been deleted.', 'success');
            var retvalue = '';
            retvalue = returnValue.result;

          } else {
            Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
          }

          this._fetchData();
          this.submitted = false;
        }, err => {
          Swal.fire('Not Deleted!', err, 'error');
         
        })
      }});
    
  }
  save(){
    if (this.formData.valid) {
     
      const _customername = this.formData.get('customername').value;
      const _customeraddress1= this.formData.get('customeraddress1').value;
      const _customeraddress2= this.formData.get('customeraddress2').value;
      const _phonenumber = this.formData.get('phonenumber').value;
      const _city = this.formData.get('city').value;
      const _state = this.formData.get('state').value;
      const _country = this.formData.get('country').value;
      const _customerid= this.formData.get('customerid').value;
      const _customeridvalue= this.formData.get('customeridvalue').value;
      const _distributioncode = this.userData['distributioncode'];
      
      let obj = new Customer();
      obj.customername = _customername;
      obj.customeraddress1 = _customeraddress1;
      obj.customeraddress2 = _customeraddress2;
      obj.customerid = _customerid;
      obj.customeridvalue = _customeridvalue;
      obj.phonenumber = _phonenumber;
       obj.city = _city;
       obj.state = _state;
       obj.country = _country;
     
      obj.distributioncode = _distributioncode;
      

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this customer!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.customerService.addCustomer(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your customer has been added.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this._fetchData();
              this.submitted = false;
            }, err => {
              Swal.fire('Not Saved!', err, 'error');
              console.log('oops', err)
            })
          }
        });

      }
      else {

        obj.customercode = this._selectedcustomercode;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this customer !',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this.customerService.editCustomer(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your customer has been Updated.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this._fetchData();
            }, err => {
              Swal.fire('Not Saved!', err, 'error');
              console.log('oops', err)
            })

          }
        });
      }
    }
    else {
     // this.findInvalidControls();
    }
    this.submitted = true
  }
 


}
