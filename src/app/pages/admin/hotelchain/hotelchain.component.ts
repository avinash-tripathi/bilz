import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, ValidatorFn,FormControl  } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';

import { ChainService } from 'src/app/core/services/chain.service';
import { HotelChain } from 'src/app/core/models/hotelchain.model';

@Component({
  selector: 'app-hotelchain',
  templateUrl: './hotelchain.component.html',
  styleUrls: ['./hotelchain.component.scss']
})
export class HotelchainComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  term: any;
  cardTitle = "New Chain";
  valButtonText = "New Chain";
  isNewEntry = true;
  userData: [];
  currentpage: number = 1;
  pageSize: number = 20;
  filtershow = '*';
  chainArray:HotelChain[]=[];
  _selectedchaincode : string;
  isSubmitted = false;
  
  show = '*';
  
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private chainService: ChainService,
    private commonService: CommonService,
    private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.breadCrumbItems = [{ label: 'CHAIN  MANAGEMENT'}, { label: 'ADD CHAIN', active: true }];
    this.formData = this.formBuilder.group({
      chainname: ['', [Validators.required]],
      defaultcurrency: ['',[Validators.required]],
      // displayPrice: ['',[Validators.required]],
      vatnumber:['',[Validators.required]],
      
      emailAddress: ['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phone: [''],
      enable: [''],
      street1: ['', [Validators.required]],
      street2: [''],
      suburb: [''],
      city: ['', [Validators.required]],
      postalcode: ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      state: [''],
      country: ['',[Validators.required]],}
    )
    this._fetchData();
  }
  get val() {
    return this.formData.controls;
  }
  hideShow(index) {
    if (this.show == index) {
      this.show = '*'
    } else {
      this.show = index;
   
    }
  }
  deleteChain(_data){
    
  }
  get form() {
    return this.formData.controls;
  }
  reset() {
    this.isNewEntry = true;
    this.submitted = false;
    this.cardTitle = "New Chain";
    this.valButtonText = "New Chain";
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  _fetchData() {
    try {
      this.chainService.getHotelChain(this.userData['distributioncode'])
        .subscribe(data => {
          this.chainArray = null;
          this.chainArray = data;
          console.log(this.chainArray);
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }
  dataToEdit(data:HotelChain){
    this.isNewEntry = false;
    this.cardTitle = "Edit Chain";
    this.valButtonText = "Edit Chain";
    this._selectedchaincode = data.chaincode;
    this.formData.controls['chainname'].setValue(data.chainname);
    this.formData.controls['emailAddress'].setValue(data.email);
        this.formData.controls['phone'].setValue(data.phone);
        this.formData.controls['street1'].setValue(data.street1);
        this.formData.controls['street2'].setValue(data.street2);
        this.formData.controls['suburb'].setValue(data.suburb);
        this.formData.controls['city'].setValue(data.city);
        this.formData.controls['postalcode'].setValue(data.pincode);
        this.formData.controls['state'].setValue(data.state);
        this.formData.controls['country'].setValue(data.country);
        this.formData.controls['vatnumber'].setValue(data.vatnumber);
    
  
  }
  deleteCustomer(obj:HotelChain){
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
        this.chainService.deleteChain(obj).subscribe(returnValue => {
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
     
      const _chainname = this.formData.get('chainname').value;
      const _displayprice= '';
      const _defaultcurrency = this.formData.get('defaultcurrency').value;
      const _street1= this.formData.get('street1').value;
      const _street2= this.formData.get('street2').value;
      const _phonenumber = this.formData.get('phone').value;
      const _email = this.formData.get('emailAddress').value;
      const _vatnumber = this.formData.get('vatnumber').value;
      const _city = this.formData.get('city').value;
      const _state = this.formData.get('state').value;
      const _country = this.formData.get('country').value;
      const _website = '';
      
      const _distributioncode = this.userData['distributioncode'];
      const _createdby = this.userData['createdby'];
      
      let obj = new HotelChain();
      obj.chainname = _chainname;
      obj.dafaultcurrency = _defaultcurrency;
      obj.displayprice = _displayprice;
      obj.street1 = _street1;
      obj.street2 = _street2;
      obj.phone = _phonenumber;
       obj.city = _city;
       obj.email = _email;
       obj.vatnumber = _vatnumber;
       obj.website = _website;
       obj.state = _state;
       obj.country = _country;
      obj.createdby = _createdby;
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
            this.chainService.addHotelChain(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Chain has been added.', 'success');
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

        obj.chaincode = this._selectedchaincode;
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
            this.chainService.updateHotelChain(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Chain has been Updated.', 'success');
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
