import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Package } from 'src/app/core/models/Package';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { Room } from 'src/app/core/models/room';
import { RoomService } from 'src/app/core/services/room.service';
import { RoomCategory } from 'src/app/core/models/roomcategory';
import { PackageService } from 'src/app/core/services/package.service';
import { Amenity } from 'src/app/core/models/amenity';
import { PackageFeature } from 'src/app/core/models/packagefeature';

@Component({
  selector: 'app-newpackage',
  templateUrl: './newpackage.component.html',
  styleUrls: ['./newpackage.component.scss']
})
export class NewpackageComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  term: any;
  cardTitle = "New Package";
  valButtonText = "New Package";
  isNewEntry = true;
  userData: [];
  currentpage: number = 1;
  pageSize: number = 20;
  filter
  show = '*';
  _selectedPackagecode:string;
  amenityData: Amenity[] = [];
  selectedAmenities: Amenity[] = [];
  packageData: Package[] = [];
  roomCategoryArray: RoomCategory[] = [];
  packagefeature:PackageFeature[]=[];
  chkAmenities: FormArray;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private packageService: PackageService,
    private commonService: CommonService,
    private datePipe: DatePipe, private roomService: RoomService) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.breadCrumbItems = [{ label: 'PACKAGE MANAGEMENT' }, { label: 'PACKAGE', active: true }];
    this.formData = this.formBuilder.group({
      packagename: ['', [Validators.required]],
      packageamount: ['0', [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$"), Validators.min(0)]],
      roomcategory: ['',],
      quantity: ['0', ],

      //roomcategory: ['', [Validators.required]],
      //quantity: ['0', [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$"), Validators.min(0)]],

      //chkAmenities: new FormArray([], this.minSelectedCheckboxes(1))
    })
    this.getRoomCategory();
    this.getAmenities();
    this._fetchData();
  }
  get form() {
    return this.formData.controls;
  }
  reset() {
    this.getAmenities();
    this.isNewEntry = true;
    this.selectedAmenities=[];
    this.submitted = false;
    this.cardTitle = "New Package";
    this.valButtonText = "New Package";
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  hideShow(index) {
    if (this.show == index) {
      this.show = '*'
    } else {
      this.show = index;

    }
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
  getRoomCategory() {
    try {

      this.roomService.getRoomCategory(this.userData['distributioncode'])
        .subscribe(data => {
          this.roomCategoryArray = null;
          this.roomCategoryArray = data;

        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }


  }
  getAmenities() {
    try {
      this.roomService.getAmenities(this.userData['distributioncode'])
        .subscribe(data => {
          this.amenityData = null;
          this.amenityData = data.filter(data => data.featuretype == 'Package');;
          //this.chkAmenities = this.formData.get('chkAmenities') as FormArray;
          //this.chkAmenities.clear();
          
          this.amenityData.forEach((item) => {
            //this.chkAmenities.push(new FormControl(false));
          });
       })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }

  dataToEdit(obj: Package) {
    this.isNewEntry = false;
    let objEdit = obj;
    this._selectedPackagecode = obj.packagecode;
    this.selectedAmenities=[];

    this.cardTitle = "Edit Package";
    this.valButtonText = "Edit Package";
   
     //this.chkAmenities.clear();
    //this.amenityData=[]; 
    this.formData.controls['packagename'].setValue(objEdit.packagename);
    this.formData.controls['packageamount'].setValue(objEdit.packageamount);

    this.amenityData.map((d)=>{d.status=false; return d;})
    this.amenityData = this.amenityData.map((d)=>{
      objEdit.packagefeatures.forEach((data=>{
        if (d.amenitycode == data.featurecode){
          d.status=true;
          this.selectedAmenities.push(d);
        }
      }))
    return d;
    })
    
    /* objEdit.packagefeatures.forEach((feature)=>{
      let objAme= new Amenity();
      if (feature.featuretype =="Package"){
        objAme.amenitycode = feature.featurecode;
        objAme.amenityname = feature.featurename;
        objAme.amenityrate= feature.amenityrate;
        objAme.hsncode = feature.hsncode;
        objAme.tax = feature.tax;
        objAme.featuretype = feature.featuretype;
        
        this.chkAmenities.push(new FormControl(true));
        this.amenityData.push(objAme);
        this.selectedAmenities.push(objAme);
      }
     
    }) */
    

  }
  deletePackage(obj:Package){
    const _distributioncode = this.userData['distributioncode'];
    const _createdby = this.userData['usercode'];
    obj.createdby = _createdby;
    obj.distributioncode = _distributioncode;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Package!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Delete it!'
    }).then(result => {
      if (result.value) {
        this.packageService.deletePackage(obj).subscribe(returnValue => {
          this.modalService.dismissAll();

          if (returnValue.result.length > 0) {
            Swal.fire('Deleted!', 'Your Package has been deleted.', 'success');
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
  onCheckChange(event, currentamenity: Amenity) {
    //this.selectedRooms.push(event.target.value);
    // this.formData.controls['packageamount']
    if (!this.isNewEntry){
      
      return;

    }
    var selectedAmenity = currentamenity;
    if (event.target.checked ) {
      this.selectedAmenities.push(selectedAmenity);
      let packageamt =   this.formData.controls['packageamount']?.value || 0;
      let packageAmount = !isNaN(packageamt) ? parseFloat(packageamt) : 0;

      packageAmount = packageAmount + selectedAmenity.amenityrate; 
      this.formData.controls['packageamount'].setValue(packageAmount);

    }
    else 
    {
      this.selectedAmenities = this.selectedAmenities.filter(
        amenity => amenity.amenitycode !== currentamenity.amenitycode
      );
      let packageamt =   this.formData.controls['packageamount']?.value || 0;
      let packageAmount = !isNaN(packageamt) ? parseFloat(packageamt) : 0;
      if (packageAmount>0){
        packageAmount = packageAmount - currentamenity.amenityrate;
        this.formData.controls['packageamount'].setValue(packageAmount);

      }


     /*  const ind = this.selectedAmenities.indexOf(currentamenity, 0);
      if (ind > -1) {
        this.selectedAmenities.splice(ind, 1);
        let packageamt =   this.formData.controls['packageamount']?.value || 0;
        let packageAmount = !isNaN(packageamt) ? parseFloat(packageamt) : 0;
        if (packageAmount>0){
          packageAmount = packageAmount - currentamenity.amenityrate;
          this.formData.controls['packageamount'].setValue(packageAmount);

        }

      } */
    }
  }
  sumPackageAmount(){
    let packageAmount =  0;
    this.amenityData.map((d)=>{
      packageAmount = d.status==true? packageAmount + d.amenityrate : packageAmount
    });
    this.formData.controls['packageamount'].setValue(packageAmount);
  }
  onChange($event){
    const id = $event.target.value;
    const isChecked = $event.target.checked;
   
    this.amenityData = this.amenityData.map((d)=>{
      if (d.amenitycode==id){
        d.status=isChecked;
        this.sumPackageAmount();
        return d;
      }
      this.sumPackageAmount();
      return d;
    })
  }

  _fetchData() {
    try {
      this.packageService.getPackage(this.userData['distributioncode'])
        .subscribe(data => {
          this.packageData = null;
          this.packageData = data;
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }


  savepackage() {
    if (this.formData.valid) {

      const _packagename = this.formData.get('packagename').value;
      const _packageamount = this.formData.get('packageamount').value;
      const _quantity = this.formData.get('quantity').value;
      const _roomcategory = this.formData.get('roomcategory').value;
      const _distributioncode = this.userData['distributioncode'];
      const _createdby = this.userData['usercode'];
      this.packagefeature=[];
      

      let obj = new Package();
      obj.packageamount = _packageamount;
      obj.packagename = _packagename;
      this.amenityData.forEach((objFeature)=>{
        let objfeature = new PackageFeature();
        if (!this.isNewEntry){
          objfeature.packagecode = this._selectedPackagecode;
        }
        objfeature.featurecode = objFeature.amenitycode
        objfeature.featuretype = objFeature.featuretype
        objfeature.quantity= 1;
        if (objFeature.status){
          this.packagefeature.push(objfeature);

        }
        
      });

      

      obj.packagefeatures = this.packagefeature;
      obj.createdby = _createdby;
      obj.distributioncode = _distributioncode;

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this Package!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.packageService.addPackage(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Package has been saved.', 'success');
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

        obj.packagecode = this._selectedPackagecode;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this Package!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this.packageService.editPackage(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Package has been Updated.', 'success');
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
      this.findInvalidControls();
    }
    this.submitted = true
  };
  findInvalidControls() {
    const invalid = [];
    const controls = this.formData.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  getAvailableRooms() { };
  filterAvailableRoom(a) { };

}
