import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { DefaultComponent } from './dashboards/default/default.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'calendar', component: CalendarComponent },
  //{ path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule), canActivate: [AuthGuard] },
  //{ path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
 
 //{ path: 'onboard', loadChildren: () => import('./onboard/onboard.module').then(m => m.OnboardModule), canActivate: [AuthGuard] },
 { path: 'catalog', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule) , canActivate: [AuthGuard]},
 { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) , canActivate: [AuthGuard]}


  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
