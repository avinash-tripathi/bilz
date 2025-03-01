import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { RoomComponent } from './room/room.component';
import { RoomamenityComponent } from './roomamenity/roomamenity.component';
import { RoomcategoryComponent } from './roomcategory/roomcategory.component';

const routes: Routes = [{
  path: 'room/booking',
  component: BookingComponent
},
{
  path: 'room/roomamenity',
  component: RoomamenityComponent
},
{
  path: 'room/newroom',
  component: RoomComponent
},
{
  path: 'room/roomcategory',
  component: RoomcategoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
