import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DetailreportComponent } from './detailreport/detailreport.component';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ReportRoutingModule } from './report-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    DetailreportComponent
  ],
  imports: [
    CommonModule,
    UIModule, WidgetModule,FormsModule, ReactiveFormsModule,
    NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule,Ng2SearchPipeModule,
    NgSelectModule,
    SimplebarAngularModule,
    NgApexchartsModule,
    NgbDatepickerModule,
    ReportRoutingModule,NgxSpinnerModule
  ]
})
export class ReportModule { }
