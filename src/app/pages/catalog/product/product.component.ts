
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/core/models/product';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductService } from 'src/app/core/services/product.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  hide=true;
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  hideme: boolean[] = [];
  cardTitle="Add Product";
  valButtonText="Add Product";
  isNewEntry = true;
  _customergroupcode = '';
  _customerid:number=0;
  userData:any;
  productData: Product[];

  term: any;
  franchiseCategoryArray : any;
  // page
  currentpage: number;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
     public activeRoute: ActivatedRoute, public productService: ProductService,
     public CommonService : CommonService ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.CommonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.franchiseCategoryArray = ['State','Zonal', 'Master', 'Regular', 'Freelancer'];
    this.breadCrumbItems = [{ label: 'CATALOG', active: false }, { label: 'Product', active: true }];
    this.formData = this.formBuilder.group({
      productcode: ['', [Validators.required]],
      productname: ['', [Validators.required]],
      costtofranchise: ['', [Validators.required]],
      costtocustomer: ['', [Validators.required]],
     
    },
      
    );

      this._fetchData();


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
    this.isNewEntry=true;
    this.formData.reset();
    this.cardTitle="Add Product";
  this.valButtonText="Add Product";
  }

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  dataToEdit(i){
    let objEdit = this.productData[i];
   
   this.cardTitle = "Edit Product";
   this.valButtonText= "Edit Product";
   this.isNewEntry=false;
   this.formData.controls['productcode'].setValue(objEdit.productcode);
   this.formData.controls['productname'].setValue(objEdit.productname);
   this.formData.controls['costtocustomer'].setValue(objEdit.costtocustomer);
   this.formData.controls['costtofranchise'].setValue(objEdit.costtofranchise);
   

  }
  _fetchData(){try
    {
      this.productService.getProducts()
      .subscribe(myCustomerData=>{
        this.productData=null;
       this.productData=myCustomerData;
       })
    }
    catch(error)
    {
      console.log('error while fetching customer record ', error);
    }}

    saveProduct()
    {

    if (this.formData.valid) {
      const _productcode = this.formData.get('productcode').value;
      const _productname = this.formData.get('productname').value;
      const _costtocustomer = this.formData.get('costtocustomer').value;
      const _costtofranchise = this.formData.get('costtofranchise').value;

      let obj = new Product();
      obj.productcode= _productcode;
      obj.productname= _productname;
      obj.costtocustomer= _costtocustomer;
      obj.costtofranchise= _costtofranchise;
      obj.punchedby= '1000';
     
      if (this.isNewEntry)
      {
      Swal.fire({
       title: 'Are you sure?',
       text: 'You want to save this Product!',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#34c38f',
       cancelButtonColor: '#f46a6a',
       confirmButtonText: 'Yes, Save it!'
     }).then(result => {
       if (result.value) {
        this.productService.addProduct(obj).subscribe(returnValue => {
          this.modalService.dismissAll();
          
          if(returnValue.result.length>0){
            Swal.fire('Saved!', 'Your Product has been saved.', 'success');
            var retvalue ='';
            retvalue = returnValue.result;
          
          } else{
            Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
          }
          
          this._fetchData();
        },err=>{
          Swal.fire('Not Saved!', err, 'error');
          console.log('oops', err)}) 
       }
     });
   }
   else
   {
     Swal.fire({
       title: 'Are you sure?',
       text: 'You want to edit this Product!',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#34c38f',
       cancelButtonColor: '#f46a6a',
       confirmButtonText: 'Yes, Edit it!'
     }).then(result => {
       if (result.value) {
        this.productService.editProduct(obj).subscribe(returnValue => {
          this.modalService.dismissAll();
          
          if(returnValue.result.length>0){
            Swal.fire('Saved!', 'Your Product has been Updated.', 'success');
            var retvalue ='';
            retvalue = returnValue.result;
          
          } else{
            Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
          }
          
          this._fetchData();
        },err=>{
          Swal.fire('Not Saved!', err, 'error');
          console.log('oops', err)}) 
        
         }
     });
   }
    }
    this.submitted = true
  }
}
