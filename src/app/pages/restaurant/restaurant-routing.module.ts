import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderhistoryComponent } from './orderhistory/orderhistory.component';
import { PrintorderComponent } from './printorder/printorder.component';
import { RestaurantmenuComponent } from './restaurantmenu/restaurantmenu.component';
import { RestaurantmenucategoryComponent } from './restaurantmenucategory/restaurantmenucategory.component';
import { RestaurantsellComponent } from './restaurantsell/restaurantsell.component';

const routes: Routes = [
  {
    path: 'restaurant/menu',
    component: RestaurantmenuComponent
  },
  {
    path: 'restaurant/menucategory',
    component: RestaurantmenucategoryComponent
  },
  {
    path: 'restaurant/sell',
    component: RestaurantsellComponent
  },
  {
    path: 'restaurant/printorder/:referencecode',
    component: PrintorderComponent
  },
  {
    path: 'restaurant/orderhistory',
    component: OrderhistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
