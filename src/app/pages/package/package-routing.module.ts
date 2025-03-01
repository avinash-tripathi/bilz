import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { NewpackageComponent } from './newpackage/newpackage.component';
import { PackageamenityComponent } from './packageamenity/packageamenity.component';

const routes: Routes = [
  {path: 'package/booking',
  component: BookingComponent},
  {path: 'package/newpackage',
  component: NewpackageComponent},
  {path: 'package/amenity',
  component: PackageamenityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackageRoutingModule { }
