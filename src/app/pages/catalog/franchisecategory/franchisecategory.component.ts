import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FranchiseCategory } from 'src/app/core/models/franchisecategory';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-franchisecategory',
  templateUrl: './franchisecategory.component.html',
  styleUrls: ['./franchisecategory.component.scss']
})
export class FranchisecategoryComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  submitted = false;
  hideme: boolean[] = [];
  cardTitle = "Add Franchise Category";
  valButtonText = "Add Franchise Category";
  term: any;
  isNewEntry = true;
  selectefranchiseCategory: FranchiseCategory;
  franchiseCategoryArray: FranchiseCategory[] = [];
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    public activeRoute: ActivatedRoute, private franchiseCategory: FranchiseService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CATALOG', active: false }, { label: 'Franchise Category', active: true }];
    this.formData = this.formBuilder.group({
      franchisecategoryname: ['', [Validators.required]],
      costtofranchise: ['', [Validators.required]],
      costtocustomer: ['', [Validators.required]],
    });
    this.getFranchiseCategory();
  }

  getFranchiseCategory() {
    this.franchiseCategory.readFranchiseCategory().subscribe(res => {
      this.franchiseCategoryArray = res;

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
    this.cardTitle = "Add Product";
    this.valButtonText = "Add Product";
  }
  dataToEdit(i) {
    var objEdit: FranchiseCategory = this.franchiseCategoryArray[i];
    this.selectefranchiseCategory = objEdit;

    this.cardTitle = "Edit Franchise Category";
    this.valButtonText = "Edit Franchise Category";
    this.isNewEntry = false;
    //this.formData.controls['franchisecategorycode'].setValue(objEdit.franchisecategorycode);
    this.formData.controls['franchisecategoryname'].setValue(objEdit.franchisecategoryname);
    this.formData.controls['costtocustomer'].setValue(objEdit.costtocustomer);
    this.formData.controls['costtofranchise'].setValue(objEdit.costtofranchise);


  }

  saveFranchiseCategory() {
    if (this.formData.valid) {
      const _franchisecategorycode = this.selectefranchiseCategory.franchisecategorycode;
      const _franchisecategoryname = this.formData.get('franchisecategoryname').value;
      const _costtocustomer = this.formData.get('costtocustomer').value;
      const _costtofranchise = this.formData.get('costtofranchise').value;

      let obj = new FranchiseCategory();
      obj.franchisecategorycode = _franchisecategorycode;
      obj.franchisecategoryname = _franchisecategoryname;
      obj.costtocustomer = _costtocustomer;
      obj.costtofranchise = _costtofranchise;
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
            this.franchiseCategory.addFranchiseCategory(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Category has been saved.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this.getFranchiseCategory();
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
            this.franchiseCategory.updateFranchiseCategory(obj).subscribe(returnValue => {
              this.modalService.dismissAll();

              if (returnValue.result.length > 0) {
                Swal.fire('Saved!', 'Your Product has been Updated.', 'success');
                var retvalue = '';
                retvalue = returnValue.result;

              } else {
                Swal.fire('Not Saved!', 'Application has encountered with some issue.', 'error');
              }

              this.getFranchiseCategory();
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
