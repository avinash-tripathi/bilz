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


@Component({
  selector: 'app-roomcategory',
  templateUrl: './roomcategory.component.html',
  styleUrls: ['./roomcategory.component.scss']
})
export class RoomcategoryComponent implements OnInit {
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
  filtershow = '*';
  roomCategoryArray:RoomCategory[]=[];
  _selectedroomcategorycode:string='';

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private packageService: PackageService,
    private commonService: CommonService,
    private datePipe: DatePipe, private roomService: RoomService) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.breadCrumbItems = [{ label: 'ROOM MANAGEMENT' }, { label: 'ADD ROOM CATEGORY', active: true }];
    this.formData = this.formBuilder.group({
      roomcategoryname: ['', [Validators.required]],
      roomrate:['',[Validators.required]],
      gst:['',[Validators.required]],
      roomcategorydescription: ['',],
    });
    this._fetchData();
  }
  get form() {
    return this.formData.controls;
  }
  reset() {
    this.isNewEntry = true;
    this.submitted = false;
    this.cardTitle = "New Room Category";
    this.valButtonText = "New Room Category";
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  _fetchData() {
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
  dataToEdit(data:RoomCategory){
    this.isNewEntry = false;
    this.cardTitle = "Edit Room Category";
    this.valButtonText = "Edit Room Category";
    this._selectedroomcategorycode = data.roomcategorycode;
    this.formData.controls['roomcategoryname'].setValue(data.roomcategoryname);
    this.formData.controls['roomrate'].setValue(data.roomrate);
    this.formData.controls['gst'].setValue(data.gst);
    this.formData.controls['roomcategorydescription'].setValue(data.roomcategorydescription);
  }
  deleteRoomCategory(obj:RoomCategory){
    const _distributioncode = this.userData['distributioncode'];
    const _createdby = this.userData['usercode'];
    obj.createdby = _createdby;
    obj.distributioncode = _distributioncode;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Room Category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Delete it!'
    }).then(result => {
      if (result.value) {
        this.roomService.deleteRoomCategory(obj).subscribe(returnValue => {
          this.modalService.dismissAll();

          if (returnValue.result.length > 0) {
            Swal.fire('Deleted!', 'Your Room Category has been deleted.', 'success');
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

      const _roomcategoryname = this.formData.get('roomcategoryname').value;
      const _roomcategorydescription = this.formData.get('roomcategorydescription').value;
      const _roomrate = this.formData.get('roomrate').value;
      const _gst = this.formData.get('gst').value;
      const _distributioncode = this.userData['distributioncode'];
      const _createdby = this.userData['usercode'];

      let obj = new RoomCategory();
      obj.roomcategoryname = _roomcategoryname;
      obj.roomcategorydescription = _roomcategorydescription;
      obj.roomrate= parseFloat(_roomrate);
      obj.gst= parseFloat(_gst);

      obj.createdby = _createdby;
      obj.distributioncode = _distributioncode;

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this Room Category!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.roomService.addRoomCategory(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Room Category has been saved.', 'success');
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

        obj.roomcategorycode = this._selectedroomcategorycode;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this Room Category!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this.roomService.editRoomCategory(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Room Category has been Updated.', 'success');
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
