import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { calculateOrder, RestaurantOrder } from 'src/app/core/models/restaurant/order';
import { CommonService } from 'src/app/core/services/common.service';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.scss']
})
export class OrderhistoryComponent implements OnInit {
  @ViewChild('contentPrint') contentPrint;
  select = 'Day';
  SaleHistoryForm: FormGroup;
  show = '*'
  showTabs='All'
  subs: Subscription = new Subscription
  userData: any
  _filtervalue:any
  OutletData = []
  userArray = [];
  SellHistory = [];
  SellHistoryArray = [];
  userVerifyCredential: any;
  _invoiceFTPUrl: string = '';
  public page = 1
  public pageSize = 10
  referencecode: string;
  customercode: any = {};
  fromdate: string;
  todate: string

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private restaurantService: RestaurantService

  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    if (this.userData.role=='Receptionist'){
      this.router.navigate(['/']);

    }
    let Value = new Date()
    this.fromdate = this.formatDate(Value);
    this.todate = this.formatDate(Value);
    this.userVerifyCredential = this.userData[0]
    this.SaleHistoryForm = this.formBuilder.group({
      status: [''],
      customer: [''],
      notes: [''],
      sellcode: [''],
      user: [''],
      date: [''],
      invoicenumber: [''],
    });
    this.getSellHistory();
  }
  tabs(item) {
    if (item == 'All') {
      this.showTabs = 'All'
    }
    if (item == 'Process') {
      this.showTabs = 'Process'
    }
    if (item == 'Continue') {
      this.showTabs = 'Continue'
    }
  }

  FilterInterval(select) {
    
    let currentDate = new Date();
    if (select == 'Day') {
      this.select = 'Day';
      //let formatedDate = new DatePipe('en-US').transform(currentDate, 'dd-MMM-yyyy')
      this.fromdate = this.formatDate(currentDate);
      this.todate = this.fromdate;
    }
    if (select == 'Week') {
      this.select = 'Week';
      var first = new Date(currentDate).getDate() - 7;
      var firstday = new Date(new Date(currentDate).setDate(first));
      var secondfirst = firstday.getDate() + 6;
      var secondfirstday = new Date(new Date(currentDate).setDate(secondfirst));
      this.fromdate = this.formatDate(new Date(firstday));
      this.todate = this.formatDate(new Date(secondfirstday));
    }
    if (select == 'Month') {
      this.select = 'Month';
      var firstDay = new Date(new Date(currentDate).getFullYear(), new Date(currentDate).getMonth());
      var secondDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

      this.fromdate = this.formatDate(new Date(firstDay));
      this.todate = this.formatDate(new Date(secondDay));

    }
  }


  SearchFilter(Value) {
    if (this.SaleHistoryForm.invalid) {
      return
    }
    this._filtervalue = Value;
  }
  ResetData() {
    this.SaleHistoryForm.reset();
    this._filtervalue = '';
 
    this.SaleHistoryForm.controls.date.setValue('');
    this.SellHistory = this.SellHistoryArray;
  }
  SearchFilterDate(Value) {
    if (this.SaleHistoryForm.invalid) {
      return
    }
    let formatedDate = new DatePipe('en-US').transform(Value, 'M/dd/yyyy')
    this._filtervalue = formatedDate;
  }

  Print(refnumber) {
   
   // this.getDeatilsOfCustomer(invoiceData.customercode, invoiceData, content);
   this.referencecode = refnumber;
    this.modalService.open(this.contentPrint,{ centered: true,size: 'lg' });
    //this.referencecode=invoiceData;

    //console.log(this.referencecode);
  }
  hideShow(index) {
    if (this.show == index) {
      this.show = '*'
    } else {
      this.show = index
    }
  }
  getTotalAmountDue(invData) {
    /* let total = 0;
    let array = invData.SellDetail;
    total = 0;
    if (invData.discountpercent != 0) {
      total = total - (total * invData.discountpercent * (0.01));
    }
    if (invData.discount != 0) {
      total = total - invData.discount;
    }
    let totalAmountDue = (total) + (total) * invData.tax * (0.01) */
    calculateOrder(invData,invData.tax);
    return this.roundOff(calculateOrder(invData,invData.tax).totalPayable);

  }
  roundOff(value: number) {
    //return Number(value.toFixed(2));
    return Number(Number(Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2));
  }

  getTotalItem(array) {
    let total = 0;
    if (array) {
      array.forEach((item) => {
        total += Number(item.quantity);
      });
      return total;
    } else {
      return 0;
    }
  }
  formatDate(dateValue: Date) {
    var returnValue =
      dateValue.getDate().toString() + '/' + this.formatMonth(dateValue.getMonth() + 1) + '/' +
      dateValue.getFullYear().toString();
    return returnValue.replace('--', '-');
  }
  formatMonth(monthNumber: number) {
    switch (monthNumber) {

      case 1:
        return 'JAN';

      case 2:
        return 'FEB';
      case 3:
        return 'MAR';
      case 4:
        return 'APR';
      case 5:
        return 'MAY';
      case 6:
        return 'JUN';
      case 7:
        return 'JUL';
      case 8:
        return 'AUG';
      case 9:
        return 'SEP';
      case 10:
        return 'OCT';
      case 11:
        return 'NOV';
      case 12:
        return 'DEC';
      default:
        return 'JAN';

    }
  }
  changeDatePlus(fromdate, todate) {
    if (this.select == 'Day') {
      var first = new Date(fromdate).getDate() - 1;
      var firstday = new Date(new Date(fromdate).setDate(first));
      this.fromdate = this.formatDate(firstday);
      this.todate = this.fromdate;

    }
    if (this.select == 'Week') {
      var first = new Date(fromdate).getDate() - 7;
      var firstday = new Date(new Date(fromdate).setDate(first));

      this.fromdate = this.formatDate(new Date(firstday));
      this.todate = fromdate;

    }
    if (this.select == 'Month') {
      var firstDay = new Date(new Date(fromdate).getFullYear(), new Date(fromdate).getMonth() - 1);
      var secondDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

      this.fromdate = this.formatDate(new Date(firstDay));
      this.todate = this.formatDate(new Date(secondDay));

    }
  }
  changeDateMin(fromdate, todate) {
    if (this.select == 'Day') {
      var first = new Date(fromdate).getDate() + 1;
      var firstday = new Date(new Date(fromdate).setDate(first));

      this.fromdate = this.formatDate(firstday);
      this.todate = this.fromdate;
    }
    if (this.select == 'Week') {
      var first = new Date(todate).getDate() + 7;
      var firstday = new Date(new Date(todate).setDate(first));

      this.fromdate = todate;
      this.todate = this.formatDate(firstday);
    }
    if (this.select == 'Month') {
      var firstDay = new Date(new Date(fromdate).getFullYear(), new Date(fromdate).getMonth() + 1);
      var secondDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

      this.fromdate = this.formatDate(new Date(firstDay));
      this.todate = this.formatDate(new Date(secondDay));
    }
  }
  getSellHistory() {
    this.spinner.show();
    var fDate = this.fromdate;
    var tDate = this.todate;
    if (this.fromdate != null && this.todate == undefined) {
      fDate = '';
      tDate = '';

    }
    this.subs.add(this.restaurantService.getRestaurantOrder(this.userData['distributioncode'],fDate,tDate,
      '').subscribe((res: any) => {
        if (res) {
          this.spinner.hide();
          this.SellHistory = null;
          this.SellHistory = res;
          this.SellHistoryArray = res;
        }
      }, err => {
        this.spinner.hide();
        this.commonService.Sweetalert(err, "error")
      }))
  }

  search() {
    this.getSellHistory();

  }
  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }
  get val() {
    return this.SaleHistoryForm.controls;
  }

}
