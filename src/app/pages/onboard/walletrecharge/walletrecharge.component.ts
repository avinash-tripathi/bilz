import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPaymentPayload } from 'src/app/core/models/confirmpaymentpayload';
import { Franchise } from 'src/app/core/models/franchise.model';
import { Ledger } from 'src/app/core/models/ledger';
import { OrderModel } from 'src/app/core/models/ordermodel';
import { Wallet } from 'src/app/core/models/wallet';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-walletrecharge',
  templateUrl: './walletrecharge.component.html',
  styleUrls: ['./walletrecharge.component.scss']
})
export class WalletrechargeComponent implements OnInit {
  @Input() walletFranchise: Franchise;
  formData: FormGroup;
  submitted = false;
  currentpage: number = 1;
  term: any;
  ledgers: Ledger[];
  userData: string[] = [];
  _currentBalance: number;
  _alphabetPattern = "^[a-zA-Z ]*$";
  disablePaymentButton = false;
  pageSize: number = 5;
  _updateWalletSuccessfully:boolean = false;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private franchiseService: FranchiseService,
    private authService: AuthenticationService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      //transactionnumber: ['', [Validators.required]],
      payeename: ['', [Validators.required, Validators.pattern(this._alphabetPattern)]],
      payeeamount: ['', [Validators.required,Validators.min(1),  Validators.pattern("^[0-9]*$")]],
      payeeemail: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      payeephone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],

    });
    if (this.authService.currentUser() != null) {
      this.userData = this.authService.currentUser();
      this._fetchData();
      this.formData.get("payeename").setValue(this.walletFranchise.franchisename);
      this.formData.get("payeeemail").setValue(this.walletFranchise.email);
      this.formData.get("payeephone").setValue(this.walletFranchise.phone);

     


    }
  }
  get form() {
    return this.formData.controls;
  }
  private _fetchData() {
    try {
      this.franchiseService.getLedger(this.walletFranchise.franchisecode)
        .subscribe(myData => {
          this.ledgers = null;
          this.ledgers = myData;
          this._currentBalance = 0;
          this.ledgers.forEach((objLedger) => {
            this._currentBalance = this._currentBalance + (objLedger.credit - objLedger.debit);

          })
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }

  rechargeWallet(){
    this.submitted = true;
    if (!this.formData.valid)
    {
     
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Recharge for this Franchise!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Recharge it!'
    }).then(result => {
      if (result.value) {
        let obj = new Wallet();
        obj.transactionnumber =   Math.floor(Math.random() * 1000000000).toString();//this.formData.get('transactionnumber').value;
        obj.credit = parseFloat(this.formData.get('payeeamount').value);
        obj.debit = 0;
        obj.franchisecode = this.walletFranchise.franchisecode;
        obj.description = 'Wallet Recharge';
        obj.transactiontype = 'RECHARGE';
        obj.punchedby = this.userData['franchisecode'];

        this.paymentService.walletRecharge(obj).subscribe((res => {
          console.log(res);
          if (res['result'] == 'INSERTED') {
            this._updateWalletSuccessfully = true;
            this.disablePaymentButton=true;
            Swal.fire('Payment Done!', 'You Recharge is Successful!', 'success');
            return this._updateWalletSuccessfully;
          }
        }), err => {
          Swal.fire('Recharge Failed!', err, 'error');
          console.log('oops', err)
        }, () => { });
      }})}

    
                  
  

}
