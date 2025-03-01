import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import { RestaurantOrder } from 'src/app/core/models/restaurant/order';
import { RestaurantOrderDetail } from 'src/app/core/models/restaurant/orderdetail';
import { RestaurantMenu } from 'src/app/core/models/restaurant/restaurantmenu';
import { TopSellingMenu } from 'src/app/core/models/restaurant/topsellingmenu';
import { CommonService } from 'src/app/core/services/common.service';

import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
// 9621727929

@Component({
  selector: 'app-restaurantsell',
  templateUrl: './restaurantsell.component.html',
  styleUrls: ['./restaurantsell.component.scss']
})
export class RestaurantsellComponent implements OnInit {
  
  orderForm: FormGroup;
  discountAmountTitle:string='Discount in %';
  parkForm: FormGroup;
  AddCustomerForm: FormGroup;
  openForm: FormGroup;
  items: FormArray;
  userData: any;
  loaded:boolean = false;
  restaurantMenus: RestaurantMenu[] = []
  
  productValue: RestaurantOrderDetail = new RestaurantOrderDetail();
  orderItems: RestaurantOrderDetail[] = []
  isSubmitted = false;
  getlocaleStorageData: any = [];
  @ViewChild('varientDataModal') myModal;
  @ViewChild('CustomerDataModal') customerModal;
  @ViewChild('centerDataModalForSwitch') centerDataModalForSwitch;
  @ViewChild('contentPrint') contentPrint;
  selectedRestaurantMenu: RestaurantMenu;
  product: any = {}
  disableButton = true
  currentDate = new Date();
  submitted = false
  customersData = []
  returnFlag = false
  customerdata: any = {}
  productReturnFlag = false
  UserFullData: any;
  openTimeDataPass: any = {}
  openTimeDataPassTax: any = 5;
  topSellingMenuArray: TopSellingMenu[] = [];
  promotion: any = {}
  PromotionFlag = false
  PromotionName: string
  SelectDiscount = 'pre'
  invaildmsgPer = false;
  invaildmsgRs = false;
  dicountAmount=0;
  Submit=false;
  show
  customer= false;
  Submitted= false;
  subTotal=0;
  totalAmount = 0;
  currentrestaurantOrder:RestaurantOrder;
  referencecode:string;
  groupedMenu: { [key: string]: any[] } = {};
  subs: Subscription = new Subscription
  @ViewChild('content') content;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router,
    
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
     private restaurantService: RestaurantService) {

  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    if (this.userData.role=='Receptionist'){
      this.router.navigate(['/']);

    }
    this.openTimeDataPassTax = this.userData.distributiondetail.restauranttax;
    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
    this.openForm = this.formBuilder.group({
      openinfloat: ['', [Validators.required]],
      notes: [''],
    });
    this.AddCustomerForm = this.formBuilder.group({
      firstname: ['', [Validators.required,]],
      lastname: ['',],//, [Validators.required]],
      mobilenumber: ['', [Validators.pattern("^[0-9]*$")]],//, [Validators.required, Validators.pattern("^[0-9]*$")]],
    
      vatnumber: ['', ],
    });
    this.parkForm = this.formBuilder.group({
      note: ['', [Validators.required]],
    });

    this.loadMenus();
    this.getTopSellingMenus();
   

  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /* addOrderItems(){
    var orderDetail = new RestaurantOrderDetail();

    this.orderItems.push(orderDetail);
  } */

  DisCardButton() {
    this.items.clear();
    this.disableButton = true
    this.productReturnFlag = false
    this.customer = false
    this.getlocaleStorageData = this.ParkSaleArray
    this.returnFlag = false
    this.product.customercode = ''
  
  }

  get valCustomer() {
    return this.AddCustomerForm.controls;
  }
  get value() {
    return this.parkForm.controls;
  }
  get val() {
    return this.openForm.controls;
  }
  ParkSaleNote() {
    this.Submitted = true;
    if (this.parkForm.invalid) {
      return
    }
    
    var array = []
    this.orderForm.controls["items"].value.forEach(element => {
      var obj = element;
      var pair = { notes: this.parkForm.value.note };
      obj = { ...obj, ...pair };
      array.push(obj)
    });
    this.ParkSale(array)
    // console.log(array, "park array");

  }
  ParkSaleArray = [];

  ParkSale(obj) {
    this.ParkSaleArray.push(obj)
    sessionStorage.setItem('parkSale', JSON.stringify(this.ParkSaleArray))
    this.restaurantService.parkSaleData.next(this.ParkSaleArray)
    this.items.clear();
    this.disableButton = true
    this.modalService.dismissAll();
    this.parkForm.reset();
  }


  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true,size: 'lg' });
  }
  createItem(item: RestaurantOrderDetail): FormGroup {
    {
      
      return this.formBuilder.group({
        quantity: '1',
        sellprice: item.sellprice,
        restaurantmenucode: item.menucode,
        restaurantmenuname:this.selectedRestaurantMenu.restaurantmenuname,
        discount: item.discount,
        note: ''
        
      });
    }
  }
  createParkedItems(item): FormGroup {
  
    return this.formBuilder.group({
      quantity: item.quantity,
      sellprice: item.sellprice,
      restaurantmenucode: item.restaurantmenucode,
      restaurantmenuname:item.restaurantmenuname,
      discount: item.discount,
      note: ''
      
    });
  }


  retrieveParkedSales(item) {
    this.items.clear();
    item.forEach(element => {
      this.disableButton=false;
      this.items.push(this.createParkedItems(element))
    });
    this.modalService.dismissAll();

  }

  roundOff(value: number) {
    return Number(Number(Math.round((value + Number.EPSILON)*100)/100).toFixed(2));
  }
  AddCustomer(){}

  select(msg) {
    this.invaildmsgPer = false
    this.invaildmsgRs = false
    this.SelectDiscount = msg
    this.discountAmountTitle = msg=='pre'? 'Discount in %' : 'Discount in Amount';

  }
  smallModal(smallDataModal: any) {
    this.invaildmsgPer = false
    this.invaildmsgRs = false
    if (this.productReturnFlag == false) {
      this.modalService.open(smallDataModal, { size: 'sm', centered: true });
    } else {
      this.commonService.Sweetalert("You can not add Discount During Return", "error")
    }
  }

  getTotalItem(array) {
    let total = 0;
    if (array.value.items.length) {
      array.value.items.forEach((item) => {
        total += Number(item.quantity);
      });
      
      return total;
    } else {
      return 0;
    }
  }
  getTotalAmount(array){
    let subtotal = this.getSubTotal(array);
    if (this.SelectDiscount=='pre' && this.dicountAmount>0)
    {
      subtotal = subtotal - subtotal* this.dicountAmount*(0.01);
    }
    if (this.SelectDiscount=='rs' && this.dicountAmount>0)
    {
      subtotal = subtotal - this.dicountAmount*(1.0);
    }
    let totalWithTax = (subtotal) + ((subtotal)* (this.openTimeDataPassTax*(0.01)))
    this.totalAmount = this.roundOff(totalWithTax);
    return this.totalAmount;
  }
  getSubTotal(array) {
    let total = 0;
     if (array.value.items.length) {
  /*     array.value.items.forEach((item) => {
      total += (Number((Number(item.quantity) * (item.sellprice - item.sellprice* this.openTimeDataPassTax/(100 + this.openTimeDataPassTax)))
                        -(Number(item.quantity) * (item.sellprice - item.sellprice* this.openTimeDataPassTax/(100 + this.openTimeDataPassTax)) * item.discount * (0.01))));
      }); */
      //let totalWithTax = (total) + ((total)* (this.openTimeDataPassTax*(0.01)))
      array.value.items.forEach((item) => {
        total += (Number((Number(item.quantity) * (item.sellprice))
                          -(Number(item.quantity) * (item.sellprice ) * item.discount * (0.01))));
        });
      this.subTotal =   this.roundOff(total);
      return   this.subTotal;
    } else {
      return 0;
    }
  }
  Addcustmer(){}
  removedicount() {
    this.dicountAmount = 0;
  }
  addDicount() {
    this.invaildmsgPer = false
    this.invaildmsgRs = false
    if (this.SelectDiscount == 'pre') {
      if (this.product.discount <= 100) {
        this.dicountAmount = this.product.discount
        this.product.discount = ''
        this.modalService.dismissAll();
      } else {
        this.invaildmsgPer = true
      }
    } else {
      if (this.product.discount <= this.getSubTotal(this.orderForm)) {
        this.dicountAmount = this.product.discount
        this.product.discount = ''
        this.modalService.dismissAll();
      } else {
        this.invaildmsgRs = true
      }
    }
  }
  removeItem(i){
    this.items.removeAt(i);
    this.items.length<=0 ? this.disableButton = true : this.disableButton=false;
  }
  addNewMenu(menucode:string){
    this.selectedRestaurantMenu=null;
        let find = this.restaurantMenus.find(x => x?.restaurantmenucode === menucode);
        this.selectedRestaurantMenu = find;
        if (find?.restaurantmenucode) {
          this.productValue.menucode = find?.restaurantmenucode; 
          this.productValue.sellprice = find?.menuprice; //find?.menurate;
           this.addItem(this.productValue);
          }

  }
    selectTopProduct(item:TopSellingMenu) {
      this.addNewMenu(item.menucode);
  }
  selectEvent(e) {
    this.addNewMenu(e.target.value);
  }
  selectCustomer(event) {}
  hideShow(index) {
    if (this.show == index) {
      this.show = '*'
    } else {
      this.show = index
    }
  }
  addItem(item:RestaurantOrderDetail ) {
    this.disableButton = false;
    if (!this.checkIfProductAlreadyInCart(item))
      this.items.push(this.createItem(item));

  }
  checkIfProductAlreadyInCart(item:RestaurantOrderDetail) {
    this.items = this.orderForm.get('items') as FormArray;
    var _itemExist = false;

    var _formControls = this.items.controls;
    _formControls.forEach(_control => {
      if (_control["controls"].restaurantmenucode.value == item.menucode) {
        _control.patchValue({
          quantity: parseInt(_control["controls"].quantity.value) + 1,
          sellprice: parseInt(_control["controls"].sellprice.value) ,

        })
        _itemExist = true;
      }

    })
    return _itemExist;
  }
  
  groupByCategory(menuArray: any[]) {
    return menuArray.reduce((acc, item) => {
      if (!acc[item.categoryname]) {
        acc[item.categoryname] = [];
      }
      acc[item.categoryname].push(item);
      return acc;
    }, {});
  }

  getTopSellingMenus(){
    this.subs.add(this.restaurantService.getTopSellingMenus(this.userData['distributioncode']).subscribe((res) => {
      if (res) {
        this.topSellingMenuArray = res;
        this.groupedMenu = this.groupByCategory(this.topSellingMenuArray);
      }
    }, err => {
      // this.spinner.hide();
      this.commonService.Sweetalert(err, "error")
    }))

  }
  
  loadMenus(){
    this.subs.add(this.restaurantService.getRestaurantMenus(this.userData['distributioncode']).subscribe((res) => {
      if (res) {
        this.restaurantMenus = res;
      }
    }, err => {
      // this.spinner.hide();
      this.commonService.Sweetalert(err, "error")
    }))

  }

  saveOrder(array){
    this.Submit = true;
    if (this.orderForm.invalid) {
      return
    }
   this.orderItems=[];

    array.value.items.forEach((item) => {
      var objOrder = new RestaurantOrderDetail();
      objOrder.quantity = Number(item.quantity);
      objOrder.sellprice= item.sellprice;
      objOrder.menucode = item.restaurantmenucode;
      objOrder.discount =item.discount;
      objOrder.note='';
      objOrder.punchedby=this.userData['usercode'];
      this.orderItems.push(objOrder);
      
      });
      var obj = new RestaurantOrder();
      obj.id=0;
      obj.sellcode='';
      obj.referencecode='';
      obj.selldetail =this.orderItems;
      obj.customercode= '';
      obj.discount = this.SelectDiscount=='pre'?0: this.dicountAmount;
      obj.discountpercent=this.SelectDiscount=='pre'?this.dicountAmount:0 ;
      obj.note='';
      obj.subtotal = this.subTotal;
      obj.tax = this.openTimeDataPassTax;
      obj.punchedby=this.userData['usercode'];
      obj.distributioncode=this.userData['distributioncode'];

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to add this Order!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, Save it!'
      }).then(result => {
        if (result.value) {
          this.disableButton=true;
          this.restaurantService.addOrder(obj).subscribe(returnValue => {
            this.modalService.dismissAll();

            if (returnValue.result.toUpperCase()=='INSERTED') {
              
              //Swal.fire('Saved!', 'You Order Is Saved.', 'success');
              this.currentrestaurantOrder = returnValue.obj;
              this.referencecode = this.currentrestaurantOrder.referencecode;
              this.loaded = true;
              //this.centerModal(this.contentPrint);
              this.orderForm.reset();
              this.ParkSaleArray=[];
              this.parkForm.reset() ;

              
              this.router.navigate(['epage/restaurant/printorder/' + this.currentrestaurantOrder.referencecode]);
    
            } else 
            {
              Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
            }

            
          }, err => {
            Swal.fire('Not Saved!', err, 'error');
            console.log('oops', err)
          })
        }
      });

  }

}
