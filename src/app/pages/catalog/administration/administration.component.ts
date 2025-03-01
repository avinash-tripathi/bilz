import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileToUpload } from 'src/app/core/models/fileupload';
import { Purchase } from 'src/app/core/models/purchase.model';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { FranchiseService } from 'src/app/core/services/franchise.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  show = '*';
  term: any;
  submitted:boolean= false;
  formData: FormGroup;
  isNewEntry = true;
  userData: String[] = [];
  cardTitle = "Upload Response File";
  _selectedPurchaseCode = '';
  _selectedFranchiseCode = '';
  _selectedCustomerName = '';
  valButtonText = "Upload";
  purchaseArray: Purchase[] = [];
  breadCrumbItems: Array<{}>;
  _base64Image: string;
  _readytoupload:boolean =false;
  _fileNameWithExt: string = '';
  _ftpPath:string=`${environment.ftpPath}`;
  imagesizeexceed: string = '';
  isSizeExceed: boolean = false;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private franchiseService: FranchiseService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CATALOG' }, 
    { label: 'Administration', active: true }];
    this.formData = this.formBuilder.group({
     

    },

    );
    if (this.authService.currentUser() != null) {
      this.userData = this.authService.currentUser();
      if (this.userData['role']=='admin'){
        this.getPurchase();
      }
 
    }
  }
  getPurchase() {
    this.franchiseService.readPurchase(this.userData['franchisecode'], 'all').subscribe((res => {
      console.log(res);
      this.purchaseArray = res;

    }))
  }
  openModal(content: any) {

    this.modalService.open(content, { centered: true });
  }

  hideShow(index) {
    if (this.show == index) {
      this.show = '*'
    } else {
      this.show = index
    }
  }
dataToEdit(obj: Purchase){
  this._selectedFranchiseCode = obj.franchisecode;
  this._selectedPurchaseCode = obj.purchasecode;
  this._selectedCustomerName= obj.customername;
}
  resetData() {
    this.isNewEntry = true;
    this.formData.reset();
    this.cardTitle = "Upload Response";
    this.valButtonText = "Upload";
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
      //application/x-zip-compressed

      if (_imageSize > 52428800) {
        this.imagesizeexceed = "Your image size is " + (_imageSize / 1048576) + "MB. *Note: Image size must not exceed above 50 MB.";
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
  replyOnPurchase() {
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
            Swal.fire('Error Occurred!', err, 'error');
            console.log('oops', err)},
            () => { this.updateAdminReply(objFileUploadResult); });

        }
      }
      );
    }
  }
  updateAdminReply(objFile:any) {
    try {

      if (objFile.result != "Success") {
        Swal.fire('Error!', 'There is some issue during file upload!', 'error');
        return;
      }
          var obj = new Purchase();
          obj.purchasecode = this._selectedPurchaseCode;
          obj.franchisecode = this._selectedFranchiseCode;
          obj.customername = this._selectedCustomerName
          
          obj.adminzipfile = objFile.obj.fileName;
           
        this.franchiseService.adminReplyOnFile (obj).subscribe((res => {
          if (res.message == 'Success' && res.result == 'Success') {
            Swal.fire('Done!', 'File uploaded in Cloud!', 'success');

          }

        }), err => {
          Swal.fire('Error Occurred!', err, 'error');
          console.log('oops', err)},
          () => { this.getPurchase(); });
      }
catch (error) {

    }
  }

}
