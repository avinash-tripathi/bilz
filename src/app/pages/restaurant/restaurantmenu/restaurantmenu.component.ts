import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantMenu } from 'src/app/core/models/restaurant/restaurantmenu';
import { RestaurantMenuCategory } from 'src/app/core/models/restaurant/restaurantmenucategory';
import { CommonService } from 'src/app/core/services/common.service';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurantmenu',
  templateUrl: './restaurantmenu.component.html',
  styleUrls: ['./restaurantmenu.component.scss']
})
export class RestaurantmenuComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  hideme: boolean[] = [];
  cardTitle = "Add Menu Name";
  valButtonText = "Add Menu Name";
  term: any;
  isNewEntry = true;
  selectedmenu: RestaurantMenu = new RestaurantMenu();
   menuArray: RestaurantMenu[] = [];
   menuCategoryArray: RestaurantMenuCategory[]=[];
   userData:any;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    public activeRoute: ActivatedRoute, private restaurantService:RestaurantService,
    private commonService : CommonService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'RESTAURANT', active: false }, { label: 'Menu Name', active: true }];
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.formData = this.formBuilder.group({
      restaurantmenucategorycode: ['', [Validators.required]],
       restaurantmenuname: ['', [Validators.required]],
       menuprice: ['', [Validators.required]],
       restaurantmenudescription: [''],
      
    });
    this.getRestaurantMenuCategories();
    this.getRestaurantMenu();
  }
  getRestaurantMenuCategories() {
    this.restaurantService.getRestaurantMenuCategories(this.userData['distributioncode']).subscribe(res => {
      this.menuCategoryArray = res;

    });

  }
  getRestaurantMenu() {
    this.restaurantService.getRestaurantMenus(this.userData['distributioncode']).subscribe(res => {
      this.menuArray = res;

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
    this.cardTitle = "Add Menu";
    this.valButtonText = "Add Menu";
  }
  dataToEdit(i) {
    this.isNewEntry = false;
    var objEdit: RestaurantMenu = this.menuArray[i];
    this.selectedmenu = objEdit;

    this.cardTitle = "Edit Menu";
    this.valButtonText = "Edit Menu";
    
    //this.formData.controls[' restaurantmenucategorycode'].setValue(objEdit. restaurantmenucategorycode);
    this.formData.controls['restaurantmenuname'].setValue(objEdit.restaurantmenuname);
    this.formData.controls['restaurantmenudescription'].setValue(objEdit.restaurantmenudescription);
    this.formData.controls['restaurantmenucategorycode'].setValue(objEdit.restaurantmenucategorycode);
    this.formData.controls['menuprice'].setValue(objEdit.menuprice);
    
  }

  saveRestaurantMenu() {
    if (this.formData.valid) {
      const _restaurantmenucategorycode = this.isNewEntry? this.formData.get('restaurantmenucategorycode').value : this.selectedmenu.restaurantmenucategorycode;
      const _restaurantmenuname = this.formData.get('restaurantmenuname').value;
      const _restaurantmenudescription = this.formData.get('restaurantmenudescription').value;
      const _menuprice = this.formData.get('menuprice').value;
     

      let obj = new RestaurantMenu();
      obj.restaurantmenucategorycode = _restaurantmenucategorycode;
      obj.restaurantmenuname = _restaurantmenuname;
      obj.restaurantmenudescription = _restaurantmenudescription;
      obj.menuprice= _menuprice;
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
            this. restaurantService.addRestaurantMenu(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Category has been saved.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this.getRestaurantMenu();
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
            this. restaurantService.updateRestaurantMenu(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Product has been Updated.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this.getRestaurantMenu();
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