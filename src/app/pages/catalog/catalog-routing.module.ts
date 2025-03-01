import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration/administration.component';
import { CustomerComponent } from './customer/customer.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
      path: 'catalog/product',
      component: ProductComponent
  },
  
  {
    path: 'catalog/administration',
    component: AdministrationComponent
  },
  
  {
    path: 'catalog/customer',
    component: CustomerComponent
  },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
