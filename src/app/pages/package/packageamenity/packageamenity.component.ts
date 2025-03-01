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

@Component({
  selector: 'app-packageamenity',
  templateUrl: './packageamenity.component.html',
  styleUrls: ['./packageamenity.component.scss']
})
export class PackageamenityComponent implements OnInit {
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
  amenityData:Amenity[]=[];
  _selectedAmenitycode:string='';
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private packageService: PackageService,
    private commonService: CommonService,
    private datePipe: DatePipe, private roomService: RoomService) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.breadCrumbItems = [{ label: 'PACKAGE MANAGEMENT' }, { label: 'ADD AMENITY', active: true }];
    this.formData = this.formBuilder.group({
      amenityname: ['', [Validators.required]],
      amenitydescription: ['',],
      hsncode:  ['', [Validators.required]],
      amenityrate:  ['', [Validators.required]],
      tax:  ['', [Validators.required]]
     
    });
    this._fetchData();
  }
  get form() {
    return this.formData.controls;
  }
  reset() {
    this.isNewEntry = true;
    this.submitted = false;
    this.cardTitle = "New Amenity";
    this.valButtonText = "New Amenity";
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  _fetchData() {
    try {
      this.roomService.getAmenities(this.userData['distributioncode'])
        .subscribe(data => {
          this.amenityData = null;
          this.amenityData = data.filter(data => data.featuretype == 'Package');
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }
  dataToEdit(data:Amenity){
    this.isNewEntry = false;
    this.cardTitle = "Edit Amenity";
    this.valButtonText = "Edit Amenity";
    this._selectedAmenitycode = data.amenitycode;
    this.formData.controls['amenityname'].setValue(data.amenityname);
    this.formData.controls['amenitydescription'].setValue(data.amenitydescription);
    this.formData.controls['amenityrate'].setValue(data.amenityrate);
    this.formData.controls['hsncode'].setValue(data.hsncode);
    this.formData.controls['tax'].setValue(data.tax);

  }
  deleteAmenity(obj:Amenity){
    const _distributioncode = this.userData['distributioncode'];
    const _createdby = this.userData['usercode'];
    obj.createdby = _createdby;
    obj.distributioncode = _distributioncode;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Amenity!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Delete it!'
    }).then(result => {
      if (result.value) {
        this.roomService.deleteAmenity(obj).subscribe(returnValue => {
          this.modalService.dismissAll();

          if (returnValue.result.length > 0) {
            Swal.fire('Deleted!', 'Your Amenity has been deleted.', 'success');
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

      const _amenityname = this.formData.get('amenityname').value;
      const _amenitydescription = this.formData.get('amenitydescription').value;
      const _amenityrate = this.formData.get('amenityrate').value;
      const _hsncode = this.formData.get('hsncode').value;
      const _tax = this.formData.get('tax').value;

      const _distributioncode = this.userData['distributioncode'];
      const _createdby = this.userData['usercode'];

      let obj = new Amenity();
      obj.amenityname = _amenityname;
      obj.amenitydescription = _amenitydescription;
      obj.featuretype= "Package";
      obj.hsncode= _hsncode;
      obj.amenityrate= _amenityrate;
      obj.tax= _tax;
      obj.createdby = _createdby;
      obj.distributioncode = _distributioncode;

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this Amenity!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.roomService.addAmenity(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Amenity has been saved.', 'success');
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

        obj.amenitycode = this._selectedAmenitycode;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this Amenity!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this.roomService.editAmenity(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Amenity has been Updated.', 'success');
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
