import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { City } from 'src/app/core/models/city';
import { FranchiseCategory } from 'src/app/core/models/franchisecategory';
import { State } from 'src/app/core/models/state';
import { StateCity } from 'src/app/core/models/statecity';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import Swal from 'sweetalert2';
import { Franchise } from '../../../core/models/franchise.model';

@Component({
  selector: 'app-franchiseonboard',
  templateUrl: './franchiseonboard.component.html',
  styleUrls: ['./franchiseonboard.component.scss']
})
export class FranchiseonboardComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  franchiseData: Franchise[];
  franchisecategorycodes: FranchiseCategory[];
  term: any;
  franchiseCategoryArray: any;
  stateArray: State[];
  cityArray: City[];
  statecityArray: StateCity[];
  cardTitle = "Add Franchise";
  valButtonText = "Add Franchise";
  isNewEntry = true;
  _franchiseCode: string = '';
  // page
  currentpage: number = 1;
  pageSize: number = 3;
  _alphabetPattern = "^[a-zA-Z ]*$";
  userData: string[] = [];
  walletFranchise: Franchise;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private franchiseService: FranchiseService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'FRANCHISE' }, { label: 'ONBOARD', active: true }];

    this.formData = this.formBuilder.group({
      franchisename: ['', [Validators.required]],
      franchisecategory: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      bankname: ['',],
      accountnumber: ['',],
      accountholdername: ['',],
      ifsccode: ['',],
      bankbranch: ['',],
      bankaddress: ['',],
      gstnumber: ['', [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],


    });

    this.currentpage = 1;

    if (this.authService.currentUser() != null) {
      this.userData = this.authService.currentUser();
    }
    this._franchisecategorycodes();

    this._fetchData();
    this._fetchState();
    this._fetchCity();
  }

  markFranchiseToRecharge(data:Franchise){
    this.walletFranchise = data;

  }

  /**
   * Customers data fetches
   */
  private filterFranchisecategorycodes(code) {
    if (this.franchisecategorycodes == null) {
      return;
    }
    this.franchiseCategoryArray = null;
    this.franchiseCategoryArray = this.franchisecategorycodes.filter(_value => _value.franchisecategorycode == code);

  }
  private _fetchData() {
    try {
      this.franchiseService.getFranchises(this.userData['franchisecode'])
        .subscribe(myData => {
          this.franchiseData = null;
          this.franchiseData = myData;
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }
  private _fetchState() {
    try {
      this.franchiseService.getStates()
        .subscribe(myData => {
          this.stateArray = null;
          this.stateArray = myData;
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }

  onStateChange(selectedState: string) {
    var objStateCity = this.statecityArray.filter(_state => _state.statecode == selectedState);
    this.cityArray = [];
    this.cityArray = objStateCity[0].cities;
  }
  private _fetchCity() {
    try {
      this.franchiseService.getCities()
        .subscribe(myData => {
          this.statecityArray = null;
          this.statecityArray = myData;
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }

  private _franchisecategorycodes() {
    try {
      this.franchiseService.getFranchiseCategoryCode()
        .subscribe(myData => {
          this.franchisecategorycodes = null;
          this.franchisecategorycodes = myData;

          this.filterFranchisecategorycodes(this.userData['franchisecategory']);

        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }

  reset() {
    this.formData.reset();
  }

  dataToEdit(data: Franchise) {
    let objEdit = data;

    this.cardTitle = "Edit Franchise";
    this.valButtonText = "Edit Franchise";
    this.isNewEntry = false;
    this.formData.controls['franchisename'].setValue(objEdit.franchisename);
    this.formData.controls['franchisecategory'].setValue(objEdit.franchisecategory);
    this.formData.controls['gstnumber'].setValue(objEdit.gstnumber);
    this.formData.controls['email'].setValue(objEdit.email);
    this.formData.controls['phone'].setValue(objEdit.phone);

    var objState = this.stateArray.filter(_statecode => _statecode.statecode == objEdit.state)[0];
    this.formData.controls['state'].setValue(objState);
    var objStateCity = this.statecityArray.filter(_statecity => _statecity.statecode == objEdit.state)[0];
    var objCity = objStateCity.cities.filter(_city => _city.citycode == objEdit.city)[0];
    this.formData.controls['city'].setValue(objCity);

    this.formData.controls['address'].setValue(objEdit.address);
    this.formData.controls['bankname'].setValue(objEdit.bankname);
    this.formData.controls['bankaddress'].setValue(objEdit.bankaddress);
    this.formData.controls['accountnumber'].setValue(objEdit.accountnumber);
    this.formData.controls['accountholdername'].setValue(objEdit.accountholdername);
    this.formData.controls['ifsccode'].setValue(objEdit.ifsccode);
    this.formData.controls['bankbranch'].setValue(objEdit.bankbranch);
    this._franchiseCode = objEdit.franchisecode;




  }


  get form() {
    return this.formData.controls;
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  openWalletModal(content: any) {
    this.modalService.open(content);
  }

  saveFranchise() {
    const currentDate = new Date();
    if (this.formData.valid) {
      const franchisename = this.formData.get('franchisename').value;
      const franchisecategory = this.formData.get('franchisecategory').value;
      const gstnumber = this.formData.get('gstnumber').value;
      const email = this.formData.get('email').value;
      const phone = this.formData.get('phone').value;
      const address = this.formData.get('address').value;

      const city = this.formData.get('city').value.citycode;
      const state = this.formData.get('state').value.statecode;
      const bankname = this.formData.get('bankname').value;
      const bankaddress = this.formData.get('bankaddress').value;
      const accountnumber = this.formData.get('accountnumber').value;
      const accountholdername = this.formData.get('accountholdername').value;
      const ifsccode = this.formData.get('ifsccode').value;
      const bankbranch = this.formData.get('bankbranch').value;
      const punchedby = this.userData['franchisecode'];

      let obj = new Franchise();
      obj.franchisename = franchisename;
      obj.franchisecategory = franchisecategory;
      obj.gstnumber = gstnumber;
      obj.email = email;
      obj.phone = phone;
      obj.city = city;
      obj.address = address;
      obj.state = state;
      obj.bankaddress = bankaddress;
      obj.bankname = bankname;
      obj.accountholdername = accountholdername;
      obj.accountnumber = accountnumber;
      obj.ifsccode = ifsccode;
      obj.bankbranch = bankbranch;
      obj.punchedby = punchedby;
      obj.introducercode = punchedby;


      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this Franchise!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.franchiseService.addFranchise(obj).subscribe(returnValue => {
              if (returnValue.result?.length > 0) {
                var retvalue = '';
                retvalue = returnValue.result;
                Swal.fire('Saved!', 'Your Franchise has been saved.', 'success');

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }
              this.modalService.dismissAll();

              this._fetchData();
            },
              error => {
                Swal.fire('Not Saved!', error, 'error');
                console.log('oops', error)
              })
          }
        });
      }
      else {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this Franchise!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            obj.franchisecode = this._franchiseCode;
            this.franchiseService.editFranchise(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result?.length > 0) {

                var retvalue = '';
                retvalue = returnValue.result;
                Swal.fire('Saved!', 'Your Franchise has been Updated.', 'success');
              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this._fetchData();
            }, error => {
              Swal.fire('Not Saved!', error, 'error');
              console.log('oops', error)
            })

          }
        });
      }
    }
    this.submitted = true

  }

}
