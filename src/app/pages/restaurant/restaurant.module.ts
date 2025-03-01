import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { RestaurantmenuComponent } from './restaurantmenu/restaurantmenu.component';
import { RestaurantmenucategoryComponent } from './restaurantmenucategory/restaurantmenucategory.component';
import { RestaurantsellComponent } from './restaurantsell/restaurantsell.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrintorderComponent } from './printorder/printorder.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    RestaurantmenuComponent,
    RestaurantmenucategoryComponent,
    RestaurantsellComponent,
    PrintorderComponent,
    OrderhistoryComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgbDropdownModule, NgbNavModule, NgbPaginationModule,Ng2SearchPipeModule,
    RestaurantRoutingModule,

  ]
})
export class RestaurantModule { }
