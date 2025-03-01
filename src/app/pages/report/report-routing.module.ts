import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailreportComponent } from './detailreport/detailreport.component';

const routes: Routes = [
  {
      path: 'report/detailreport',
      component: DetailreportComponent
  },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
