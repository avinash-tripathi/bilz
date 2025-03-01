import { Component, OnInit, ViewChild } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart } from './data';
import { DashboardChartType } from './dashboard.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../core/services/event.service';

import { ConfigService } from '../../../core/services/config.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BookingService } from 'src/app/core/services/booking.service';
import { Booking } from 'src/app/core/models/booking';
import { StatDataModel } from 'src/app/core/models/statdata';
import { ChartComponent } from "ng-apexcharts";
import { visitorsOptions, popularPostData } from "./defaultdata";

import { ChartType } from "./blog.model";
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { Subscription } from 'rxjs';
import { earningLineChart, salesAnalyticsDonutChart, ChatData } from './donutdata';
import { DonutChartType, ChatMessage } from './donut.model';
import { TopSellingMenu } from 'src/app/core/models/restaurant/topsellingmenu';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  // visitor chart
  visitorsOptions: ChartType;
  popularPostData;
  isVisible: string;

  emailSentBarChart: DashboardChartType;
  monthlyEarningChart: DashboardChartType;
  transactions: Array<[]>;
  statData: StatDataModel[] = [];

  earningLineChart: ChartType;
  salesAnalyticsDonutChart: DonutChartType;
  ChatData: ChatMessage[];

  sassEarning: Array<Object>;
  sassTopSelling: Array<Object>;

  
  userData: any;
  isActive: string;

  term: any;
  _ftpPath: string = `${environment.ftpPath}`;
  currentBalance: string = "";
  purchaseArray: any;
  totalRoomInvoice: number = 0;
  totalPackageInvoice: number = 0;
  bookingData: Booking[] = [];
  roombookingData: Booking[] = [];
  pkgbookingData: Booking[] = [];
  validlicense="";
  fromdate: string;
  todate: string
  SellHistory = [];
  topsellingmenus : TopSellingMenu[]=[];
  subs: Subscription = new Subscription
  public activeOptionButton = "all";
  @ViewChild('content') content;
  constructor(private modalService: NgbModal,
    private configService: ConfigService,
    private eventService: EventService,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private router: Router, private bookingService: BookingService,private restaurantService: RestaurantService) {
    if (this.authService.currentUser()['role'] == 'SuperAdmin' || 
    this.authService.currentUser()['role'] == 'Manager' ||
    this.authService.currentUser()['role'] == 'Receptionist' || 
    this.authService.currentUser()['role'] == 'POS') 
    {
      this.validlicense = this.authService.currentUser()['validlicense'];
    }
    else
    {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    

  }

  ngOnInit() {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    /**
     * horizontal-vertical layput set
     */
    const attribute = document.body.getAttribute('data-layout');

    this.isVisible = attribute;
    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
        console.log(horizontal);
      }
    }
    if (this.authService.currentUser() != null) {

      this.userData = this.authService.currentUser();
      if (this.userData['role'] == 'admin') {
        // this.getPurchase();
        // this.fetchData();
      }

      //this._userName = userData["name"];
    }

    /**
     * Fetches the data
     */
    this._fetchData('');
    this._fetchChartData();
    this._fetchChartData1();
    this.getSellHistory();
    this.getTopSellingProducts();
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
  getTopSellingProducts(){

    this.restaurantService.getTopSellingMenus(this.userData['distributioncode']).subscribe(res => {
      this.topsellingmenus = res;
      this.salesAnalyticsDonutChart.series= this.topsellingmenus.map(item => item.totalquantity);
      this.salesAnalyticsDonutChart.labels= this.topsellingmenus.map(item => item.menuname);

    });

  }
  getSellHistory() {
    this.spinner.show();
    let Value = new Date()
    this.fromdate = this.formatDate(Value);
    this.todate = this.formatDate(Value);
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
          this.transactions = res.map((item, index) => ({
            id: item.referencecode, // Convert to string if necessary
            name: item.punchedbyname, // Mapping name from API data
            date: item.selldate, // Mapping date
            total: item.subtotal.toString(), // Ensure it's a string
            status: item.sellstatus, // Mapping status
            payment: 'cash', // Convert payment into an array
            index: index, // Set index manually
          }));
        }
      }, err => {
        this.spinner.hide();
        this.commonService.Sweetalert(err, "error")
      }))
  }

  public updateOptionsData = {
    "1m": {
      series: [{
        name: 'Current',
        data: [12, 22, 38, 42, 32, 40, 51, 36, 51, 29, 38, 36],
    }, {
        name: 'Previous',
        data: [22, 31, 36, 26, 47, 56, 42, 64, 61, 52, 42, 31],
    }]
    },
    "6m": {
      series: [{
        name: 'Current',
        data: [31, 40, 28, 51, 42, 40, 51, 36, 40, 39, 31, 36],
    }, {
        name: 'Previous',
        data: [11, 32, 45, 32, 34, 22, 51, 60, 51, 52, 40, 31],
    }]
    },
    "1y": {
      series: [{
        name: 'Current',
        data: [28, 22, 38, 42, 32, 40, 51, 36, 51, 29, 38, 36],
    }, {
        name: 'Previous',
        data: [22, 31, 36, 26, 47, 56, 42, 64, 61, 52, 42, 31],
    }]
    },
    all: {
      series: [{
        name: 'Current',
        data: [18, 21, 45, 36, 65, 47, 51, 32, 40, 28, 31, 26]
    }, {
        name: 'Previous',
        data: [30, 11, 22, 18, 32, 23, 58, 45, 30, 36, 15, 34]
    }]
    }
  };

  _fetchChartData1(){
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;
    this.earningLineChart = earningLineChart;
    this.salesAnalyticsDonutChart = salesAnalyticsDonutChart;
    
    this.ChatData = ChatData;

    this.isActive = 'year';
    this.configService.getConfig().subscribe(data => {
      //this.transactions = data.transactions;
      //this.statData = data.statData;
      this.sassEarning = data.sassEarning;
      this.sassTopSelling = data.sassTopSelling;
    });
  }

  updateOptions(option: any) {
    this.activeOptionButton = option;
    this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
  }

  private _fetchChartData() {
    this.visitorsOptions = visitorsOptions;
    this.popularPostData = popularPostData;
  }

  ngAfterViewInit() {
    if (this.validlicense!='valid')
     setTimeout(() => {
       this.openModal();
     }, 2000);
  }

  /**
   * Fetches the data
   */
  _fetchData(bookingcode) {
    try {
      var checkinTodayData: Booking[] = [];
      var bookingTodayaData: Booking[] = [];
      var checkoutTodayaData: Booking[] = [];

      this.bookingService.getBooking(bookingcode, this.userData['distributioncode'], '', '', 'active')
        .subscribe(data => {
          //this.bookingData = data.filter(obj=> obj.featuretype=='Package');
          this.bookingData = [];
          this.bookingData = data;
          this.roombookingData = data.filter(obj => (obj.featuretype == 'Room'));
          this.pkgbookingData = data.filter(obj => (obj.featuretype == 'Package'));
          var obj = new StatDataModel();
          obj.title = 'Rooms';
          obj.icon = 'home' ;
          obj.value = this.roombookingData.length.toString();
          this.statData.push(obj);
          var objP = new StatDataModel();
          objP.title = 'Packages';
          objP.icon = 'package' ;
          objP.value = this.pkgbookingData.length.toString();
          this.statData.push(objP);

          bookingTodayaData = data.filter(obj => {
            // Parse checkin date and current date to compare only the date part
            const bookingTodayDate = new Date(obj.bookingdatefrom).toDateString(); // Get the date part
            const currentDate = new Date().toDateString(); // Get the current date part
            return bookingTodayDate === currentDate; // Compare the date strings
          });
          var objbookingTodayDate = new StatDataModel();
          objbookingTodayDate.title = 'Booking Today';
          objbookingTodayDate.icon = 'calendar-event' ;
          objbookingTodayDate.value = bookingTodayaData.length.toString();
          this.statData.push(objbookingTodayDate);

          checkinTodayData = data.filter(obj => {
            // Parse checkin date and current date to compare only the date part
            const checkinDate = new Date(obj.checkin).toDateString(); // Get the date part
            const currentDate = new Date().toDateString(); // Get the current date part
            return checkinDate === currentDate; // Compare the date strings
          });
          var objCheckin = new StatDataModel();
          objCheckin.title = 'Checkin Today';
          objCheckin.icon = 'log-in' ;
          objCheckin.value = checkinTodayData.length.toString();
          this.statData.push(objCheckin);

          checkoutTodayaData = data.filter(obj => {
            // Parse checkin date and current date to compare only the date part
            const checkoutDate = new Date(obj.checkout).toDateString(); // Get the date part
            const currentDate = new Date().toDateString(); // Get the current date part
            return checkoutDate === currentDate; // Compare the date strings
          });
          var objCheckout = new StatDataModel();
          objCheckout.title = 'Checkout Today';
          objCheckout.icon = 'log-out' ;
          objCheckout.value = checkoutTodayaData.length.toString();
          this.statData.push(objCheckout);

          




          this.bookingData.map((allInv) => {
            if (allInv.featuretype == 'Package') {
              this.totalPackageInvoice = this.totalPackageInvoice + 1;
            }
            if (allInv.featuretype == 'Room') {
              this.totalRoomInvoice = this.totalRoomInvoice + 1;
            }


          });
          //this.totalPackageInvoice = this.bookingData.filter(obj=> obj.featuretype=='Package').length;
          //this.totalRoomInvoice =   this.bookingData.filter(obj=> obj.featuretype=='Invoice').length;



        })
    }
    catch (error) {


    }
    finally {

    }
  }

  openModal() {
    this.modalService.open(this.content, { centered: true });
  }

  weeklyreport() {
    this.isActive = 'week';
    this.emailSentBarChart.series =
      [{
        name: 'Series A',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Series B',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Series C',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }];
  }

  monthlyreport() {
    this.isActive = 'month';
    this.emailSentBarChart.series =
      [{
        name: 'Series A',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Series B',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Series C',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }];
  }

  yearlyreport() {
    this.isActive = 'year';
    this.emailSentBarChart.series =
      [{
        name: 'Series A',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Series B',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Series C',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }];
  }


  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}
