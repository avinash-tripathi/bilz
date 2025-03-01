import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminRoutingModule } from './admin-routing.module';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { SetupComponent } from './setup/setup.component';
import { HotelchainComponent } from './hotelchain/hotelchain.component';

@NgModule({
  declarations: [
    RoleComponent,
    
   
    UserComponent,
             SetupComponent,
             HotelchainComponent
  ],
  imports: [
    CommonModule,
    UIModule,WidgetModule,
    FormsModule, ReactiveFormsModule,
    NgbPaginationModule,NgbModalModule,
    NgbNavModule,NgbDropdownModule,Ng2SearchPipeModule,
    NgSelectModule,
    NgxSpinnerModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
