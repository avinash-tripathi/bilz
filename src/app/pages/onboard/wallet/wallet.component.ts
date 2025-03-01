import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPaymentPayload } from 'src/app/core/models/confirmpaymentpayload';
import { Ledger } from 'src/app/core/models/ledger';
import { OrderModel } from 'src/app/core/models/ordermodel';
import { Wallet } from 'src/app/core/models/wallet';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
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
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private franchiseService: FranchiseService,
    private authService: AuthenticationService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'FRANCHISE' }, { label: 'MY WALLET', active: true }];
    this.formData = this.formBuilder.group({
      payeename: ['', [Validators.required, Validators.pattern(this._alphabetPattern)]],
      payeeamount: ['', [Validators.required,Validators.pattern("^-?(0|[1-9]\d*)?$/")]],
      payeeemail: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      payeephone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],

    });
    if (this.authService.currentUser() != null) {
      this.userData = this.authService.currentUser();
      this.formData.get("payeename").setValue(this.userData['franchisename']);
      this.formData.get("payeeemail").setValue(this.userData['email']);
      this.formData.get("payeephone").setValue(this.userData['phone']);

    }
    this._fetchData();

  }
  get form() {
    return this.formData.controls;
  }
  pay() {
    try {
      this.submitted = true;
      let objOrder = new OrderModel();
      objOrder.franchisecode = this.userData['franchisecode'];
      objOrder.amount = parseFloat(this.formData.get('payeeamount').value) * 100;
      objOrder.contactNumber = this.formData.get('payeephone').value;
      objOrder.email = this.formData.get('payeeemail').value;
      objOrder.currency = 'INR';
      objOrder.name = this.formData.get('payeename').value;
      objOrder.address = '';
      objOrder.description = 'payment';
      this.paymentService.initializePayment(objOrder).subscribe((_paymentResult) => {
        var _objJson = JSON.parse(_paymentResult);
        objOrder.orderId = _objJson.id;
        this.disablePaymentButton = true;
        //console.log(_paymentResult);
      }, err => { console.log(err) },
        async () => {
          let _status = await this.proceedPayment(this.paymentService, objOrder);
          if (_status) {
            this._fetchData();
          }
        });
    }
    catch (e) {
      Swal.fire('Some Error Occurred!', 'Please contact to admin!', 'error');

    }

  }
  private async proceedPayment(payment: PaymentService, objOrder: OrderModel) {
    let objPayload = new ConfirmPaymentPayload();
    let _rechargeSuccessfully = false;
    let _updateWalletSuccessfully = false;
    try {

      objOrder.key = 'rzp_test_UvZzNN6Iwd5fWx';
      let options = {
        "key": objOrder.key,
        "amount": objOrder.amount.toString(),
        "currency": "INR",
        "name": "TYB10x",
        "order_id": objOrder.orderId,
        "description": objOrder.description,
        "image": "/assets/images/TYB-Logo-Black.png",
        "handler": function (response) {
          objPayload.razorpay_payment_id = response.razorpay_payment_id;
          objPayload.razorpay_order_id = response.razorpay_order_id;
          objPayload.razorpay_signature = response.razorpay_signature;

          if (objPayload.razorpay_payment_id != null) {
            payment.confirmPayment(objPayload).subscribe((res => {
              console.log(res);
              if (res == 'PaymentSuccessful') {
                _rechargeSuccessfully = true;
              }

            }), err => {
              Swal.fire('Payment Fails! Contact to admin', err, 'error');
              console.log('oops', err)
            },
              () => {
                if (_rechargeSuccessfully) {
                  let obj = new Wallet();
                  obj.transactionnumber = objPayload.razorpay_payment_id;
                  obj.credit = objOrder.amount / 100;
                  obj.debit = 0;
                  obj.franchisecode = objOrder.franchisecode;
                  obj.description = 'Wallet Recharge';
                  obj.transactiontype = 'RECHARGE';

                  payment.walletRecharge(obj).subscribe((res => {
                    console.log(res);
                    if (res['result'] == 'INSERTED') {
                      _updateWalletSuccessfully = true;
                      Swal.fire('Payment Done!', 'You Recharge is Successful!', 'success');
                      return _updateWalletSuccessfully;
                    }



                  }), err => {
                    Swal.fire('Recharge Failed!', err, 'error');
                    console.log('oops', err)
                  }, () => { });
                  
                }
              }
            );
          }



        },
        modal: {
          // We should prevent closing of the form when esc key is pressed.
          escape: false,
        },

        "prefill": {
          "name": objOrder.name,
          "email": objOrder.email,
          "contact": objOrder.contactNumber
        },
        "notes": {
          "address": objOrder.address
        },
        "theme": {
          "color": "#F37254"
        }
      };


      let rzp1 = this.franchiseService._window().Razorpay(options);
      rzp1.on('payment.failed', function (response) {

        let errorMessage = '';
        errorMessage = response.error.code + '\n' +
          response.error.description + '\n' +
          response.error.source + '\n' +
          response.error.step + '\n' +
          response.error.reason + '\n' +
          response.error.metadata.order_id + '\n' +
          response.error.metadata.payment_id

        Swal.fire('Payment Fail!', errorMessage, 'error');

      });

      rzp1.open();
    }
    catch (e) {
      return _updateWalletSuccessfully;
    }


  }
  private _fetchData() {
    try {
      this.franchiseService.getLedger(this.userData['franchisecode'])
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
}
