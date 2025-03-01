import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StatComponent } from './stat/stat.component';
import { TransactionComponent } from './transaction/transaction.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { BookinginvoiceComponent } from './bookinginvoice/bookinginvoice.component';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  declarations: [StatComponent, TransactionComponent, InvoiceComponent, BookinginvoiceComponent],
  imports: [
    CommonModule,
    NgbModalModule,
    NgxPrintModule,
   

  ],
  exports: [StatComponent, TransactionComponent,InvoiceComponent,BookinginvoiceComponent]
})
export class WidgetModule { }
