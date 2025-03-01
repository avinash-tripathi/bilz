import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetModule } from '../../shared/widget/widget.module';
import { DropzoneModule,DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { CommonModule } from '@angular/common';
import { OnboardRoutingModule } from './onboard-routing.module';
import { FranchiseonboardComponent } from './franchiseonboard/franchiseonboard.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from '../../shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { WalletComponent } from './wallet/wallet.component';
import { WalletrechargeComponent } from './walletrecharge/walletrecharge.component';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 7,
  addRemoveLinks: true,
  //acceptedFiles: '*'
};
@NgModule({
  declarations: [
    
    FranchiseonboardComponent,
         FileuploadComponent,
         WalletComponent,
         WalletrechargeComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    DropzoneModule,
    WidgetModule,
    FormsModule, ReactiveFormsModule,
    OnboardRoutingModule,
    NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule,Ng2SearchPipeModule,
    NgSelectModule,
    SimplebarAngularModule,
    NgApexchartsModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
 
})
export class OnboardModule { }
