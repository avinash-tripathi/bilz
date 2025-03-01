import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { DefaultComponent } from './default/default.component';

const routes: Routes = [
    {
        path: 'default',
        component: DefaultComponent,canActivate:[AuthGuard]
    },
   
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}
