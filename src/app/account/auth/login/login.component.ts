import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  passwordVisible: boolean = false;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
  
   private authFackservice: AuthfakeauthenticationService,
   private CommonService : CommonService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
   togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.spinner.show();
        //var hashOfPassword = CryptoJS.SHA256(this.f.password.value).toString(CryptoJS.enc.Hex);
        var hashOfPassword =  CryptoJS.SHA256(this.f.password.value).toString(CryptoJS.enc.Hex);
        this.authFackservice.login(this.f.email.value, hashOfPassword)
          .pipe(first())
          .subscribe(
            data => {
              this.spinner.hide();
              sessionStorage.setItem(environment.dataKey, this.CommonService.utoa(JSON.stringify(data)))
              
              if(data.role=='SuperAdmin' || data.role=='Receptionist'|| data.role=='Manager'|| data.role=='POS'){
                this.router.navigate(['/epage/dashboard']);
              }
              else if (data.role=='franchise' && data.firsttimelogin==false){
                this.router.navigate(['/epage/franchisedashboard']);
              }
              else if (data.role=='franchise' && data.firsttimelogin==true){
                this.router.navigate(['/reset-password']);
              }
              else if (data.role=='admin' && data.firsttimelogin==true){
                this.router.navigate(['/reset-password']);
              }
              else if (data.email==null){
                this.error='Invalid Credentials. Either User id or Password is incorrect.'

              }
              
            },
            error => {
              this.spinner.hide();
              this.error = error ? error : '';
            });
      }
    }
  
}
