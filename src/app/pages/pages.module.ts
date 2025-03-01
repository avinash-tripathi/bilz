import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbModalModule,
   NgbTooltipModule , NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { LightboxModule } from 'ngx-lightbox';
import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { UiModule } from './ui/ui.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OnboardModule } from './onboard/onboard.module';
import { CatalogModule } from './catalog/catalog.module';
import {ReportModule} from './report/report.module';
import { RoomModule } from './room/room.module';
import { PackageModule } from './package/package.module';
import { CalendarComponent } from './calendar/calendar.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminModule } from './admin/admin.module';
import { RestaurantModule } from './restaurant/restaurant.module';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

@NgModule({
  declarations: [ 
    
    CalendarComponent, 
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModalModule,
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    
    //EcommerceModule,
    
    HttpClientModule,
    
    UIModule,
    
    //UtilityModule,
    UiModule,
       WidgetModule,
    
    FullCalendarModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgxSpinnerModule,
    SimplebarAngularModule,
    LightboxModule,
    OnboardModule,
    CatalogModule,
    ReportModule,
    RoomModule,
    PackageModule,
    NgxSpinnerModule,
    AdminModule,
    RestaurantModule,
    NgxSpinnerModule
  ],
})
export class PagesModule { }
