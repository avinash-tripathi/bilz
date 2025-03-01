import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgxSpinnerModule } from "ngx-spinner";
import { PackageRoutingModule } from './package-routing.module';
import { BookingComponent } from './booking/booking.component';
import { NewpackageComponent } from './newpackage/newpackage.component';
import { PackageamenityComponent } from './packageamenity/packageamenity.component';


@NgModule({
  declarations: [
    BookingComponent,
    NewpackageComponent,
    PackageamenityComponent
  ],
  imports: [
    CommonModule,
    UIModule,WidgetModule,
    FormsModule, ReactiveFormsModule,
    NgbPaginationModule,NgbModalModule,
    NgbNavModule,NgbDropdownModule,Ng2SearchPipeModule,
    NgSelectModule,PackageRoutingModule,NgbTooltipModule, NgxSpinnerModule
  
  ]
})
export class PackageModule { }
