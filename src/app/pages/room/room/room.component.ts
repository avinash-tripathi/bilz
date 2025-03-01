import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, ValidatorFn,FormControl  } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { Room } from 'src/app/core/models/room';
import { RoomService } from 'src/app/core/services/room.service';
import { PackageService } from 'src/app/core/services/package.service';
import { RoomCategory } from 'src/app/core/models/roomcategory';
import { Amenity } from 'src/app/core/models/amenity';



@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  term: any;
  cardTitle = "New Room";
  valButtonText = "New Room";
  isNewEntry = true;
  userData: [];
  currentpage: number = 1;
  pageSize: number = 20;
  filtershow = '*';
  roomArray:Room[]=[];
  roomCategoryArray:RoomCategory[]=[];
  _selectedroomcode:string='';
  availableAmenities:Amenity[]=[];
  selectedAmenities:Amenity[]=[];
  //chkAmenities:FormArray;
  show = '*';
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private packageService: PackageService,
    private commonService: CommonService,
    private datePipe: DatePipe, private roomService: RoomService) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.breadCrumbItems = [{ label: 'ROOM MANAGEMENT'}, { label: 'ADD ROOM', active: true }];
    this.formData = this.formBuilder.group({
      roomname: ['', [Validators.required]],
      roomdescription: ['',],
      roomcategory: ['',[Validators.required]],
      
    
    });
    
    this.getRoomCategory();
    this._fetchData();
    this.getAmenities();

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
  // onCheckChange(event, currentamenity:Amenity) {
  //   //this.selectedRooms.push(event.target.value);
  //   var selectedAmenity = currentamenity;
  //   if (event.target.checked) {
  //     this.selectedAmenities.push(selectedAmenity);
  //   }
  //   else {
  //     const ind = this.selectedAmenities.indexOf(selectedAmenity, 0);
  //     if (ind > -1) {
  //       this.selectedAmenities.splice(ind, 1);
  //     }
  //   }
  // }
  onChange($event){
    const id = $event.target.value;
    const isChecked = $event.target.checked;
    this.availableAmenities = this.availableAmenities.map((d)=>{
      if (d.amenitycode==id){
        d.status=isChecked;
        return d;
      }
      return d;
    })
  }
  get form() {
    return this.formData.controls;
  }
  reset() {
    this.isNewEntry = true;
    this.submitted = false;
    this.cardTitle = "New Room";
    this.valButtonText = "New Room";
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  _fetchData() {
    try {
      this.roomService.getRooms(this.userData['distributioncode'])
        .subscribe(data => {
          this.roomArray = null;
          this.roomArray = data;
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }
  dataToEdit(data:Room){
    this.isNewEntry = false;
    this.cardTitle = "Edit Room";
    this.valButtonText = "Edit Room";
    this._selectedroomcode = data.roomcode;
    this.formData.controls['roomname'].setValue(data.roomname);
    this.formData.controls['roomcategory'].setValue(data.roomcategory);
    //this.formData.controls['roomrate'].setValue(data.roomrate);
    this.formData.controls['roomdescription'].setValue(data.roomdescription);
    this.availableAmenities.map((d)=>{d.status=false; return d;})
    this.availableAmenities = this.availableAmenities.map((d)=>{
      data.amenities.forEach((data=>{
        if (d.amenitycode == data.amenitycode){
          d.status=true;
        }
      }))
    return d;
    })
   
  }

  getAmenities(){
    try {
      
      this.roomService.getAmenities(this.userData['distributioncode'])
        .subscribe(data => {
          this.availableAmenities = null;
          this.availableAmenities = data.filter(aminity=> aminity.featuretype.toUpperCase()=='ROOM')
              //       this.chkAmenities = this.formData.get('chkAmenities') as FormArray;
    // this.chkAmenities.clear();
    // this.availableAmenities.forEach((item)=>{
    //       if (this.selectedAmenities.indexOf(item)>-1){
    //         this.chkAmenities.push(new FormControl(true));
    //       }
    //       else
    //       {this.chkAmenities.push(new FormControl(false));}
    //});
    this.availableAmenities =  this.availableAmenities.map((d)=>{
      d.status=false;
      return d;
    })
  
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
    
  }
  getRoomCategory(){
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

  deleteRoom(obj:Room){
    const _distributioncode = this.userData['distributioncode'];
    const _createdby = this.userData['usercode'];
    obj.createdby = _createdby;
    obj.distributioncode = _distributioncode;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Room!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Delete it!'
    }).then(result => {
      if (result.value) {
        this.roomService.deleteRoom(obj).subscribe(returnValue => {
          this.modalService.dismissAll();

          if (returnValue.result.length > 0) {
            Swal.fire('Deleted!', 'Your Room has been deleted.', 'success');
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
      this.selectedAmenities = this.availableAmenities.filter(data => data.status == true);
      if (this.selectedAmenities==undefined || this.selectedAmenities.length<=0){
        Swal.fire({title:"info",text:'Please select atleast one Amenity',icon: 'warning'})
        return false;

      }
      const _roomname = this.formData.get('roomname').value;
      const _roomdescription= this.formData.get('roomdescription').value;
      //const _roomrate = this.formData.get('roomrate').value;
      const _roomrcategory = this.formData.get('roomcategory').value;
      const _distributioncode = this.userData['distributioncode'];
      const _createdby = this.userData['usercode'];

      let obj = new Room();
      obj.roomname = _roomname;
      obj.roomdescription = _roomdescription;
      obj.roomcategory = _roomrcategory;
      obj.amenities=this.selectedAmenities;
      obj.createdby = _createdby;
      obj.distributioncode = _distributioncode;

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this Room!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.roomService.addRoom(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Room has been added.', 'success');
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

        obj.roomcode = this._selectedroomcode;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this Room !',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this.roomService.editRoom(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Room has been Updated.', 'success');
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
  }
 

}
