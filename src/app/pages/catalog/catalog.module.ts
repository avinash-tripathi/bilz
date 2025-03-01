import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule }
  from '@ng-bootstrap/ng-bootstrap';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgSelectModule } from '@ng-select/ng-select';
import { CatalogRoutingModule } from './catalog-routing.module';
import { ProductComponent } from './product/product.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FranchisetoproductComponent } from './franchisetoproduct/franchisetoproduct.component';
import { AdministrationComponent } from './administration/administration.component';
import { FranchisecategoryComponent } from './franchisecategory/franchisecategory.component';
import { CustomerComponent } from './customer/customer.component';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 7,
  //acceptedFiles: '*'
};
@NgModule({
  declarations: [
    ProductComponent,
    FranchisetoproductComponent,
    AdministrationComponent,
    FranchisecategoryComponent,
    CustomerComponent
  ],
  imports: [

    CommonModule,
    UIModule,
    WidgetModule,
    FormsModule, ReactiveFormsModule,
    DropzoneModule,
    NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule, Ng2SearchPipeModule,
    NgSelectModule,
    CatalogRoutingModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
})
export class CatalogModule { }
