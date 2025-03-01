import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantMenuCategory } from 'src/app/core/models/restaurant/restaurantmenucategory';
import { CommonService } from 'src/app/core/services/common.service';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurantmenucategory',
  templateUrl: './restaurantmenucategory.component.html',
  styleUrls: ['./restaurantmenucategory.component.scss']
})
export class RestaurantmenucategoryComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  hideme: boolean[] = [];
  cardTitle = "Add Menu Category";
  valButtonText = "Add Menu Category";
  term: any;
  isNewEntry = true;
  selectedmenuCategory: RestaurantMenuCategory = new RestaurantMenuCategory();
   menuCategoryArray: RestaurantMenuCategory[] = [];
   userData:any;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    public activeRoute: ActivatedRoute, private restaurantService:RestaurantService,
    private commonService : CommonService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'RESTAURANT', active: false }, { label: 'Menu Category', active: true }];
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.formData = this.formBuilder.group({
       restaurantmenucategoryname: ['', [Validators.required]],
       restaurantmenucategorydescription: [''],
      
    });
    this.getRestaurantMenuCategory();
  }

  getRestaurantMenuCategory() {
    this.restaurantService.getRestaurantMenuCategories(this.userData['distributioncode']).subscribe(res => {
      this. menuCategoryArray = res;

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
    this.cardTitle = "Add Menu Category";
    this.valButtonText = "Add Menu Category";
  }
  dataToEdit(i) {
    var objEdit: RestaurantMenuCategory = this.menuCategoryArray[i];
    this.selectedmenuCategory = objEdit;

    this.cardTitle = "Edit Menu Category";
    this.valButtonText = "Edit Menu Category";
    this.isNewEntry = false;
    //this.formData.controls[' restaurantmenucategorycode'].setValue(objEdit. restaurantmenucategorycode);
    this.formData.controls['restaurantmenucategoryname'].setValue(objEdit.restaurantmenucategoryname);
    this.formData.controls['restaurantmenucategorydescription'].setValue(objEdit.restaurantmenucategorydescription);
    
  }

  saveRestaurantCategory() {
    if (this.formData.valid) {
      const _restaurantmenucategorycode = this.selectedmenuCategory.restaurantmenucategorycode;
      const _restaurantmenucategoryname = this.formData.get('restaurantmenucategoryname').value;
      const _restaurantmenucategorydesc = this.formData.get('restaurantmenucategorydescription').value;
     

      let obj = new RestaurantMenuCategory();
      obj.restaurantmenucategorycode = _restaurantmenucategorycode;
      obj.restaurantmenucategoryname = _restaurantmenucategoryname;
      obj.restaurantmenucategorydescription = _restaurantmenucategorydesc;
      obj.createdby = this.userData['usercode'];
      obj.distributioncode = this.userData['distributioncode'];
      
      //obj.punchedby = '1000';

      if (this.isNewEntry) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to save this Category!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Save it!'
        }).then(result => {
          if (result.value) {
            this. restaurantService.addRestaurantMenuCategory(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Category has been saved.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this.getRestaurantMenuCategory();
            }, err => {
              Swal.fire('Not Saved!', err, 'error');
              console.log('oops', err)
            })
          }
        });
      }
      else {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to edit this Category!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#34c38f',
          cancelButtonColor: '#f46a6a',
          confirmButtonText: 'Yes, Edit it!'
        }).then(result => {
          if (result.value) {
            this. restaurantService.updateRestaurantMenuCategory(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Product has been Updated.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this.getRestaurantMenuCategory();
            }, err => {
              Swal.fire('Not Saved!', err, 'error');
              console.log('oops', err)
            })

          }
        });
      }
    }
    this.submitted = true

  }

}