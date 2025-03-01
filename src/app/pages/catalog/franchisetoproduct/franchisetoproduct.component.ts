import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FranchiseToProduct } from 'src/app/core/models/franchisetoproduct';
import { Product } from 'src/app/core/models/product';
import { ProductOnly } from 'src/app/core/models/productonly';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-franchisetoproduct',
  templateUrl: './franchisetoproduct.component.html',
  styleUrls: ['./franchisetoproduct.component.scss']
})
export class FranchisetoproductComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  hideme: boolean[] = [];
  cardTitle = "Add Product to Franchise";
  valButtonText = "Add Product to Franchise";
  isNewEntry = true;
  _customergroupcode = '';
  _customerid: number = 0;
  userData: any;
  franchiseData: FranchiseToProduct[];
  products:ProductOnly[]=[];

  term: any;
  franchiseCategoryArray: any;
  // page
  currentpage: number;
  productToranchiseCategoryMap:ProductOnly[]=[];

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    public activeRoute: ActivatedRoute, public franchiseService: FranchiseService,
    public productService: ProductService) { }

  ngOnInit(): void {
    this.franchiseCategoryArray = ['State', 'Zonal', 'Master', 'Regular', 'Freelancer'];
    
    this.breadCrumbItems = [{ label: 'CATALOG', active: false }, { label: 'Franchise Category to Product', active: true }];
    this.formData = this.formBuilder.group({
       franchiseCategory: ['', [Validators.required]],
       costtocustomer: ['0', [Validators.required]],
       costtofranchise: ['0', [Validators.required]],
      // selectedProduct: ['', [Validators.required]],
    },

    );

    this._fetchData();


  }
  reset(){
    this.formData.reset();
  }

  bindfranchiseCategory(franchiseCategory:string){
    this.franchiseService.getAllProductWithFranchiseCategory(franchiseCategory)
    .subscribe((result) => {
      this.productToranchiseCategoryMap = result[0]['products'];
    });

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
  resetData() {
    this.isNewEntry = true;
    this.formData.reset();
    this.cardTitle = "Add Product to Franchise";
    this.valButtonText = "Add Product to Franchise";
  }

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  dataToEdit(franchise: FranchiseToProduct) {
    let objEdit = franchise;

    this.cardTitle = "Edit Product to Franchise";
    this.valButtonText = "Edit Product to Franchise";
    this.isNewEntry = false;
    //this.formData.controls['productcode'].setValue(objEdit.productcode);
    //this.formData.controls['productname'].setValue(objEdit.productname);


  }
  _fetchData() {
    try {
      this.franchiseService.readProductMapWithFranchiseCategory()
        .subscribe(myCustomerData => {
          this.franchiseData = null;
          this.franchiseData = myCustomerData;
          console.log(myCustomerData);
        })
    }
    catch (error) {
      console.log('error while fetching customer record ', error);
    }
  }

  addSelectedProduct(value:Product,selected:boolean){

    if (selected){
      var obj = new ProductOnly();
      obj.productcode= value.productcode;
      obj.productname = value.productname;
      obj.status = selected;
      this.products.push(obj);
    }
    if (!selected){
      this.products.forEach((obj,index)=>{
        if(obj.productcode==value.productcode){
          delete  this.products[index];
        }
      })
      
    }
    
   

  }

  saveProduct() {

    if (this.formData.valid) {
      this.products=[];
      this.productToranchiseCategoryMap.forEach((obj,index)=>{
        if(obj.status){
          this.products.push(obj);
        }
      });

      if (this.products==null){
        return null;
      }
     
      const _franchisecategory = this.formData.get('franchiseCategory').value;
      let obj = new FranchiseToProduct();
      obj.franchisecategory = _franchisecategory;
      obj.products =  this.products;

      
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to Map selected Product!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this.productService.addFranchiseToProduct(obj).subscribe(returnValue => {
              this.modalService.dismissAll();
              Swal.fire('Saved!', 'Your Product has been saved.', 'success');
              if (returnValue.result.length > 0) {

                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this._fetchData();
            },err=>{
              Swal.fire('Not Saved!', err, 'error');
              console.log('oops', err)})
          }
        });
     
      
    }
    this.submitted = true
  }

}
