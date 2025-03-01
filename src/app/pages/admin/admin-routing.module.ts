import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelchainComponent } from './hotelchain/hotelchain.component';
import { RoleComponent } from './role/role.component';
import { SetupComponent } from './setup/setup.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [{
  path: 'admin/role',
  component: RoleComponent
},
{
  path: 'admin/user',
  component: UserComponent
},
{
  path: 'admin/setup',
  component: SetupComponent
},
{
  path: 'admin/chain',
  component: HotelchainComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
