import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule,NgbTooltipModule } 
from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimplebarAngularModule } from 'simplebar-angular';
import { RoomRoutingModule } from './room-routing.module';
import { BookingComponent } from './booking/booking.component';
import { DatePipe } from '@angular/common';
import { RoomamenityComponent } from './roomamenity/roomamenity.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { RoomComponent } from './room/room.component';
import { RoomcategoryComponent } from './roomcategory/roomcategory.component';
@NgModule({
  declarations: [BookingComponent, RoomamenityComponent, RoomComponent,RoomcategoryComponent],
  imports: [
    CommonModule,
    UIModule,WidgetModule,
    FormsModule, ReactiveFormsModule,
    RoomRoutingModule,NgbPaginationModule,NgbModalModule,NgbTooltipModule,
    NgbNavModule,NgbDropdownModule,Ng2SearchPipeModule,
    NgSelectModule,
    NgxSpinnerModule
  ],
  providers:[DatePipe]
})
export class RoomModule { }
