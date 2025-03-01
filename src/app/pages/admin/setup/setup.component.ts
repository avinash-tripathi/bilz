import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { SetupService } from 'src/app/core/services/setup.service';
import { environment } from 'src/environments/environment';
import { SetupDetails } from '../../../core/models/generalsetup.model';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  GeneralSetupDetails: SetupDetails;
  generalSetupForm: FormGroup;
  subs: Subscription = new Subscription
  userData: any
  productData:any
  Supplier = []
  isSubmitted = false;
  constructor(private modalService: NgbModal,private spinner: NgxSpinnerService,
     private router: Router,private setup: SetupService,private CommonService: CommonService, 
     private formBuilder: FormBuilder) { 

     }


  ngOnInit(): void {
    this.userData = JSON.parse(this.CommonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.generalSetupForm = this.formBuilder.group({
      hotelName: ['', [Validators.required]],
      defaultCurrency: ['',[Validators.required]],
      // displayPrice: ['',[Validators.required]],
      vatNumber:['', [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],
      firstName: ['',[Validators.required]],
      lastName: [''],
      emailAddress: ['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phone: [''],
      enable: [''],
      street1: ['', [Validators.required]],
      street2: [''],
      suburb: [''],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      state: [''],
      country: ['',[Validators.required]],
      restauranttax: ['', [Validators.required,Validators.min(0), 
        Validators.max(100),Validators.pattern(/^(100|[1-9]?[0-9])(\.\d{1,2})?$/)]],
      
      includekot: ['',[Validators.required]],
    }

    )
    this.getGeneralSetupDetails();
  }
  get val() {
    return this.generalSetupForm.controls;
  }
  getvalue
  getGeneralSetupDetails(){
    this.spinner.show();
    this.subs.add(this.setup.getGeneralSetupDetails(this.userData['distributioncode']).subscribe((res:any) => {
      if (res) {
        this.spinner.hide();
        console.log(res);
        this.getvalue=res
        // this.CommonService.Sweetalert(res.result, "success")
        this.generalSetupForm.controls['hotelName'].setValue(res[0].distributionname);
        this.generalSetupForm.controls['defaultCurrency'].setValue(res[0].dafaultcurrency);
        // this.generalSetupForm.controls['displayPrice'].setValue('IncTax');
        this.generalSetupForm.controls['firstName'].setValue(res[0].firstname);
        this.generalSetupForm.controls['enable'].setValue(res[0].enablenegativeinventory);
        this.generalSetupForm.controls['lastName'].setValue(res[0].lastname);
        this.generalSetupForm.controls['emailAddress'].setValue(res[0].email);
        this.generalSetupForm.controls['phone'].setValue(res[0].phone);
        this.generalSetupForm.controls['street1'].setValue(res[0].street1);
        this.generalSetupForm.controls['street2'].setValue(res[0].street2);
        this.generalSetupForm.controls['suburb'].setValue(res[0].suburb);
        this.generalSetupForm.controls['city'].setValue(res[0].city);
        this.generalSetupForm.controls['postalCode'].setValue(res[0].pincode);
        this.generalSetupForm.controls['state'].setValue(res[0].state);
        this.generalSetupForm.controls['country'].setValue(res[0].country);
        this.generalSetupForm.controls['vatNumber'].setValue(res[0].vatnumber);
        this.generalSetupForm.controls['restauranttax'].setValue(res[0].restauranttax);
        this.generalSetupForm.controls['includekot'].setValue(res[0].includekot);
  
  
        //this.GeneralSetupDetails=new SetupDetails(1,res[0].hotelName,'','','',1,1,1,'','','','','');
      }
    }, err => {
      this.spinner.hide();
      this.CommonService.Sweetalert(err, "error")
    }))
   }
UpdateGeneralSetupDetails(){
    console.log(this.generalSetupForm);
    this.isSubmitted=true
    if (this.generalSetupForm.invalid) {
      this.CommonService.Sweetalert('Invalid State', "success")
      this.findInvalidControls();
      return
    }
    this.isSubmitted=false
    this.GeneralSetupDetails=new SetupDetails(1,this.generalSetupForm.get('hotelName').value,
    "IncTax",this.generalSetupForm.get('defaultCurrency').value,
    this.generalSetupForm.get('vatNumber').value,this.generalSetupForm.get('firstName').value,
    this.generalSetupForm.get('lastName').value,this.generalSetupForm.get('emailAddress').value,
    this.generalSetupForm.get('phone').value,this.generalSetupForm.get('street1').value,
    this.generalSetupForm.get('street2').value,this.generalSetupForm.get('suburb').value,
    this.generalSetupForm.get('city').value,this.generalSetupForm.get('postalCode').value,
    this.generalSetupForm.get('state').value,
    this.generalSetupForm.get('country').value,
    this.userData['distributioncode'],
    this.generalSetupForm.get('restauranttax').value,
    this.generalSetupForm.get('includekot').value,
    true);
    this.spinner.show();
    this.subs.add(this.setup.updateGeneralSetupDetails(this.GeneralSetupDetails).subscribe((res:any) => {
      console.log(res);
      this.spinner.hide();
      if (res) {
        this.CommonService.Sweetalert(res.result, "success")
      }
      else{
        this.CommonService.Sweetalert(res.result, "error")
      }
    }, err => {
      this.spinner.hide();
      this.CommonService.Sweetalert(err.result, "error")
    }))
  }
  findInvalidControls() {
    const invalid = [];
    const controls = this.generalSetupForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  switchValueChanged(_checked) {
    console.log(_checked );

  }
  CleanFilter(){
    this.generalSetupForm.reset();
    this.generalSetupForm.controls['emailAddress'].setValue('');
  }

}
