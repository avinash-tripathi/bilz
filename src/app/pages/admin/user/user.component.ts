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
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  formResetData: FormGroup;
  submitted = false;
  term: any;
  cardTitle = "New Role";
  valButtonText = "New Role";
  isNewEntry = true;
  userData: any;
  currentpage: number = 1;
  pageSize: number = 20;
  filter
  show = '*';
  usersData:User[]=[];
  resetUser:User;
  _selectedUsercode:string='';
  roleArray:Role[]=[];
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private commonService: CommonService,
    private userService: UserProfileService,private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.breadCrumbItems = [{ label: 'ADMIN MANAGEMENT' }, { label: 'ADD USER', active: true }];
    this.formData = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      mobileno: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      street1: ['', ],
      street2: ['', ],
      city: ['', ],
      role: ['', [Validators.required]],
     
    });
    this.formResetData= this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword:['', [Validators.required, Validators.minLength(8)]],
    }, {
      validator: this.ConfirmedValidator('password', 'confirmpassword')
    });
    this.roles();
   

  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  get f() {
    return this.formResetData.controls;
  }
  get form() {
    return this.formData.controls;
  }
  reset() {
    this.isNewEntry = true;
    this.submitted = false;
    this.cardTitle = "New User";
    this.valButtonText = "New User";
    this.formData.reset();
  }
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  openResetModal( obj:User, content: any) {
    this.resetUser = obj;
    this.modalService.open(content, { size: 'sm', backdrop: 'static' });
  }

  roles() {
    try {
      this.spinner.show();
      this.userService.getRole(this.userData['distributioncode'])
        .subscribe(data => {
          this.spinner.hide();
          this.roleArray = null;
          this.roleArray = null;

          if (this.userData.role.toUpperCase() === 'MANAGER') {
            this.roleArray = data.filter(val => val.rolename !== "SuperAdmin");
          } else {
            this.roleArray = data;
          }
          
        })
        this._fetchData();
    }
    catch (error) {
      this.spinner.hide();
      console.log('error while fetching customer record ', error);
    }
    finally{
    
    }
  }

  _fetchData() {
    try {
      this.spinner.show();
      this.userService.getUser(this.userData['distributioncode'])
        .subscribe(data => {
          this.spinner.hide();
          this.usersData = null;
          if (this.roleArray && Array.isArray(this.roleArray)) {
            this.usersData = data.filter(user => 
              this.roleArray.some(role => role.rolecode === user.rolecode)
            );
          } else {
            this.usersData = [];
          }
        })
    }
    catch (error) {
      this.spinner.hide();
      console.log('error while fetching customer record ', error);
    }
    finally{
    
    }
  }
  dataToEdit(data:User){
    this.isNewEntry = false;
    this.cardTitle = "Edit User";
    this.valButtonText = "Edit User";
    this._selectedUsercode = data.usercode;
    this.formData.controls['username'].setValue(data.username);
    this.formData.controls['email'].setValue(data.email);
    this.formData.controls['mobileno'].setValue(data.mobileno);
    this.formData.controls['street1'].setValue(data.street1);
    this.formData.controls['street2'].setValue(data.street2);
    this.formData.controls['city'].setValue(data.city);
    this.formData.controls['role'].setValue(data.rolecode);
    
  }
  deleteUser(obj:User){
    const _distributioncode = this.userData['distributioncode'];
    const _createdby = this.userData['usercode'];
    obj.createdby = _createdby;
    obj.distributioncode = _distributioncode;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this User!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Delete it!'
    }).then(result => {
      if (result.value) {
        this.userService.deleteUser(obj).subscribe(returnValue => {
          this.modalService.dismissAll();

          if (returnValue.result.length > 0) {
            Swal.fire('Deleted!', 'Your User has been deleted.', 'success');
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
  resetPassword(){

    if (this.formResetData.valid) {
      const _password = this.formResetData.get('password').value;
      const _distributioncode = this.userData['distributioncode'];
      this.resetUser.password = _password;
      this.resetUser.distributioncode = _distributioncode;

        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to reset password!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Reset it!'
        }).then(result => {
          if (result.value) {
            this.userService.resetPassword(this.resetUser).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your password reset successfully!.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }
              this.submitted = false;
            }, err => {
              Swal.fire('Issue Occurred!', err, 'error');
            
            })
          }
        });

      


    }
  }
  save(){
    if (this.formData.valid) {
      const _username = this.formData.get('username').value;
      const _email = this.formData.get('email').value;
      const _mobileno = this.formData.get('mobileno').value;
      const _street1 = this.formData.get('street1').value;
      const _street2 = this.formData.get('street2').value;
      const _city = this.formData.get('city').value;
      const _role = this.formData.get('role').value;
      const _distributioncode = this.userData['distributioncode'];
      const _createdby = this.userData['usercode'];

      let obj = new User();
      obj.username = _username;
      obj.email = _email;
      obj.mobileno = _mobileno;
      obj.city = _city;
      obj.street1= _street1;
      obj.street2 = _street2;
      obj.createdby = _createdby;
      obj.rolecode = _role;
      obj.distributioncode = _distributioncode;

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this user!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.userService.addUser(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your user has been saved.', 'success');
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

        obj.usercode = this._selectedUsercode;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this user!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this.userService.editUser(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your user has been Updated.', 'success');
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

