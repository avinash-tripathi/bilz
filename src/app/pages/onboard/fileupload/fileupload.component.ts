import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileToUpload } from 'src/app/core/models/fileupload';
import { Product } from 'src/app/core/models/product';
import { Purchase } from 'src/app/core/models/purchase.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  userData: String[] = [];
  formData: FormGroup;
  submitted = false;
  _readytoupload = false;
  currentpage: number=1;
  pageSize:number=5;
  _currentWalletBalance: number = 0;
  productToFranchiseCategoryMap: Product[] = [];
  purchaseArray: Purchase[] = [];
  _cost: number = 0;
  
  _base64Image: string = '';
  _fileNameWithExt: string = '';
  term: any;
  imagesizeexceed: string = '';
  selectedPurchase:Purchase;
  invoiceType:string;
  isSizeExceed: boolean = false;
  _alphabetPattern="^[a-zA-Z ]*$";
  _ftpPath:string=`${environment.ftpPath}`;

  constructor(private modalService: NgbModal,private formBuilder: FormBuilder,
    private franchiseService: FranchiseService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'FRANCHISE' }, { label: 'UPLOAD FILE', active: true }];
    this.formData = this.formBuilder.group({
      customername: ['', [Validators.required,Validators.pattern(this._alphabetPattern)]],
      phone: ['', [Validators.required,Validators.pattern("^[0-9]{10}$")]],
      //gstnumber: ['', [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],
      // selectedProduct: ['', [Validators.required]],
    });
    if (this.authService.currentUser() != null) {
      this.userData = this.authService.currentUser();
      this.bindfranchiseCategory();
    }
    this.franchiseService.getLedger(this.userData['franchisecode']).subscribe((res => {
      res.forEach((objLedger) => {
        this._currentWalletBalance = this._currentWalletBalance + (objLedger.credit - objLedger.debit);

      })

    }));
    this.getPurchase();

  }
  openModal(content: any,selectedPurchase:Purchase,invoiceType:string) {
    this.selectedPurchase = selectedPurchase;
    this.invoiceType=invoiceType;
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }
  roundOff(val:number){
      return val.toFixed(2);
  }
  get form() {
    return this.formData.controls;
  }

  getPurchase() {
    this.franchiseService.readPurchase(this.userData['franchisecode'], 'all').subscribe((res => {
      console.log(res);
      this.purchaseArray = res;

    }))
  }


  calculateCost() {
    this._cost = 0;
    this.productToFranchiseCategoryMap.forEach(element => {
      if (element.status) {
        this._cost = this._cost + element.costtofranchise;
      }
    });

  }
  bindfranchiseCategory() {
    this.franchiseService.getProductMapWithFranchiseCategory(this.userData['franchisecategory']).subscribe((result) => {
      this.productToFranchiseCategoryMap = result;

    });

  }


  onUploadError(args: any) {
    console.log('onUploadError:', args);
  }
 

  onUploadSuccess(args: any) {
    try {
      //1MB = 1,000,000 Bytes
      //50 MB = 52428800 Bytes (in binary)
      // 1 MB = 1048576 Bytes (in binary)
      var val = args[1].files.file.toString();
      var _imageSize = args[0].size;
      this._fileNameWithExt = args[0].name;
      var _imageType = args[0].type
      console.log("image type"+_imageType);
      //application/x-zip-compressed
      //application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip

      if (_imageSize > 5242880) {
        this.imagesizeexceed = "Your image size is " + (_imageSize / 1048576) + "MB. *Note: Image size must not exceed above 5 MB.";
        this.isSizeExceed = true;
        this._readytoupload = false;
      }
      else if (_imageType == 'application/x-zip-compressed' || _imageType == 'application/zip'
      || _imageType == 'application/octet-stream' || _imageType == 'multipart/x-zip'
      ) {
        this.isSizeExceed = false;
        this._readytoupload = true;
        this.imagesizeexceed = '';
      }
      else {
        this.imagesizeexceed = "File uploaded is not .zip file";
        this._readytoupload = false;
        this.isSizeExceed = true;

       

      }

      var base64Index = val.indexOf(';base64,') + ';base64,'.length;
      this._base64Image = val.substring(base64Index);
    }
    catch (error) {

    }
    finally {

    }

  }
  downloadDocFile(obj: Purchase) {

  }
  updateWallet(objFile) {
    try {

      if (objFile.result != "Success") {
        Swal.fire('Error!', 'There is some issue during file upload!', 'error');
        return;
      }

      var _arrayOfPurchase: Purchase[] = [];
      this.productToFranchiseCategoryMap.forEach((_ele => {
        if (_ele.status) {
          var obj = new Purchase();
          obj.productcode = _ele.productcode;
          obj.costtocustomer = _ele.costtocustomer;
          obj.costtofranchise = _ele.costtofranchise;
          obj.franchisecode = this.userData['franchisecode'];
          obj.customername = this.formData.get('customername').value;
          obj.customermobile = this.formData.get('phone').value;
          
          obj.zipfilename = objFile.obj.fileName;
          obj.punchedby = this.userData['franchisecode'];
          _arrayOfPurchase.push(obj);
        }
      }));

      if (_arrayOfPurchase?.length > 0) {
        this.franchiseService.addPurchase(_arrayOfPurchase).subscribe((res => {
          if (res.message == 'INSERTED' && res.result == 'Success') {
            this._readytoupload = false;
            this.formData.reset();
            Swal.fire('Done!', 'File uploaded in Cloud!', 'success');

          }

        }), err => {
          Swal.fire('Not Saved!', err, 'error');
          console.log('oops', err)},
          () => { this.getPurchase(); });
      }


    }
    catch (error) {

    }
  }
  savePurchase() {
    this.submitted = true;
    if (!this.formData.valid) {
      return;
    }
    var objFileUploadResult;

    let objFile = new FileToUpload();
    objFile.fileAsBase64 = this._base64Image;
    objFile.fileName = this._fileNameWithExt.split(".")[0];
    objFile.fileType = '.zip';
    objFile.fileInitial = this.userData['franchisecode'];
    if (this._readytoupload) {

      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to upload file for this Customer!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, Upload it!'
      }).then(result => {
        if (result.value) {
          this.franchiseService.addImage(objFile).subscribe(res => {
            console.log(res);
            objFileUploadResult = res;
            this._readytoupload = false;
          }, err => {
            Swal.fire('File not Saved!', err, 'error');
            console.log('oops', err)},
            () => { this.updateWallet(objFileUploadResult); });

        }
      }
      );
    }}

  }
