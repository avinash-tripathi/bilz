import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { FranchiseonboardComponent } from './franchiseonboard/franchiseonboard.component';
import { WalletComponent } from './wallet/wallet.component';
import { WalletrechargeComponent } from './walletrecharge/walletrecharge.component';

const routes: Routes = [
  {
      path: 'onboard/franchise',
      component: FranchiseonboardComponent
  },
  {
    path: 'onboard/upload',
    component: FileuploadComponent
  },
  {
    path: 'onboard/wallet',
    component: WalletComponent
  },
  {
    path: 'onboard/walletrecharge',
    component: WalletrechargeComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardRoutingModule { }
