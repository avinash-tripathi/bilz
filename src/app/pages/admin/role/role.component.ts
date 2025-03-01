import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Role } from 'src/app/core/models/role';
import { UserProfileService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  term: any;
  cardTitle = "New Role";
  valButtonText = "New Role";
  isNewEntry = true;
  userData: [];
  currentpage: number = 1;
  pageSize: number = 20;
  filter
  show = '*';
  roleData:Role[]=[];
  _selectedRolecode:string='';
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private commonService: CommonService,
    private userService: UserProfileService,private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.breadCrumbItems = [{ label: 'ADMIN MANAGEMENT' }, { label: 'ADD ROLE', active: true }];
    this.formData = this.formBuilder.group({
      rolename: ['', [Validators.required]],
      
     
    });
    this._fetchData();

  }
  get form() {
    return this.formData.controls;
  }
  reset() {
    this.isNewEntry = true;
    this.submitted = false;
    this.cardTitle = "New Role";
    this.valButtonText = "New Role";
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  _fetchData() {
    try {
      this.spinner.show();
      this.userService.getRole(this.userData['distributioncode'])
        .subscribe(data => {
          this.spinner.hide();
          this.roleData = null;
          this.roleData = data;
        })
    }
    catch (error) {
      this.spinner.hide();
      console.log('error while fetching customer record ', error);
    }
    finally{
    
    }
  }
  dataToEdit(data:Role){
    this.isNewEntry = false;
    this.cardTitle = "Edit Role";
    this.valButtonText = "Edit Role";
    this._selectedRolecode = data.rolecode;
    this.formData.controls['rolename'].setValue(data.rolename);
    
  }
  save(){
    if (this.formData.valid) {
      const _rolename = this.formData.get('rolename').value;
      const _distributioncode = this.userData['distributioncode'];
      const _createdby = this.userData['usercode'];

      let obj = new Role();
      obj.rolename = _rolename;
      obj.createdby = _createdby;
      obj.distributioncode = _distributioncode;

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this role!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.userService.addRole(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your role has been saved.', 'success');
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

        obj.rolecode = this._selectedRolecode;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this role!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this.userService.editRole(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your role has been Updated.', 'success');
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
