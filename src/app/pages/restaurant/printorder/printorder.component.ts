import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { isObject } from 'rxjs/internal-compatibility';
import { calculateOrder, RestaurantOrder, RestaurantOrderPayment } from 'src/app/core/models/restaurant/order';
import { RestaurantOrderDetail } from 'src/app/core/models/restaurant/orderdetail';
import { RestaurantMenu } from 'src/app/core/models/restaurant/restaurantmenu';
import { CommonService } from 'src/app/core/services/common.service';
import { LanguageService } from 'src/app/core/services/language.service';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-printorder',
  templateUrl: './printorder.component.html',
  styleUrls: ['./printorder.component.scss']
})
export class PrintorderComponent implements OnInit {
  userData: any;
  currentrestaurantOrder: RestaurantOrder;
  isLoaded :boolean = false;
  formData: FormGroup;
  submitted = false;
  hideme: boolean[] = [];
  cardTitle="Manage Your Order";
  valButtonText="Save";
 
  constructor(
    private modalService: NgbModal,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private restaurantService: RestaurantService

  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.formData = this.formBuilder.group({
      tablename: ['', [Validators.required]],
      attendedbyname: ['', [Validators.required]],
      
     
    })

    const referencecode = this.route.snapshot.paramMap.get('referencecode');
    this.restaurantService.getRestaurantOrder(this.userData['distributioncode'],'','',referencecode).subscribe((ret)=>{
      this.currentrestaurantOrder = ret[0];
      

    })
  
  }
  get form() {
    return this.formData.controls;
  }
  /**
   * Open modal
   * @param content modal content
   * 
   */
  openModal(content: any) {
    
    this.modalService.open(content);
  }
  resetData(){
    
    this.formData.reset();
    this.cardTitle="Manage Your Order";
    this.valButtonText="Save";
  }

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  dataToEdit(i){
  
  }
  saveOrder(){
    {

      if (this.formData.valid) {
        const _tablename = this.formData.get('tablename').value;
        const _attendedbyname = this.formData.get('attendedbyname').value;
        
  
        let obj = new RestaurantOrderPayment();
        obj.tablename= _tablename;
        obj.attendedbyname= _attendedbyname;
        obj.cardnumber='';
        obj.customercode='';
        obj.paidamount= calculateOrder(this.currentrestaurantOrder,this.currentrestaurantOrder.tax).totalPayable;
        obj.paymentmethod='';
        obj.paymenttype='';
        obj.referencecode=this.currentrestaurantOrder.referencecode;
        
        obj.distributioncode= this.userData['distributioncode'];
        obj.punchedby= this.userData['usercode'];
       
        Swal.fire({
         title: 'Are you sure?',
         text: 'You want to save this!',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#34c38f',
         cancelButtonColor: '#f46a6a',
         confirmButtonText: 'Yes, Save it!'
       }).then(result => {
         if (result.value) {
          this.restaurantService.updateOrder(obj).subscribe(returnValue => {
            this.modalService.dismissAll();
            if(returnValue.result.length>0){
              Swal.fire('Saved!', 'Your Order has been saved.', 'success');
              var retvalue ='';
              retvalue = returnValue.result;
              this.currentrestaurantOrder.sellcode = returnValue.obj.sellcode;
              this.isLoaded=true;
            } else{
              Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
            }
            
            
          },err=>{
            Swal.fire('Not Saved!', err, 'error');
            console.log('oops', err)}) 
         }
       });
    
     
      }
      this.submitted = true
    }
  }

  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }

}
