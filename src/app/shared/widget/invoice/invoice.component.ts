import { Component, Input, OnInit } from '@angular/core';
import * as printJS from "print-js";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { calculateOrder, RestaurantOrder } from 'src/app/core/models/restaurant/order';
import { RestaurantService } from 'src/app/core/services/restaurant.service';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SetupDetails } from 'src/app/core/models/generalsetup.model';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @Input() purchase: string;
  
 // bread crumb items
 breadCrumbItems: Array<{}>;
 _purchase: RestaurantOrder
_subtotalCost:number=0;
_sgstCost:string='';
_cgstCost:string='';

_totalCost:string="";
_totalQuantity:number=0;
userData:any;
distributionData : SetupDetails
loaded:boolean=false;
 constructor( private commonService : CommonService,
   private restaurantService: RestaurantService,
   private spinner: NgxSpinnerService,) { 

   }
   

 ngOnInit() {
   
   this.breadCrumbItems = [{ label: 'Invoices' }, { label: 'Detail', active: true }];
   this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
   this.distributionData = this.userData.distributiondetail;
   console.log(this.distributionData);
   
   this._subtotalCost=0;
   this.restaurantService.getRestaurantOrder(this.userData['distributioncode'],'','',this.purchase).subscribe((ret)=>{
    this._purchase = ret[0];
    this._purchase.selldetail.map((v=>{
      this._totalQuantity= this._totalQuantity+ v.quantity;
      
    }));
    var discountAmount=0;

    this._subtotalCost = calculateOrder(this._purchase,this._purchase.tax).subtotal;
    if (this._purchase.discount>0){
      discountAmount = this._purchase.discount;
    }
    if (this._purchase.discountpercent>0){
      discountAmount = this._subtotalCost*this._purchase.discountpercent*(0.01);
    }
    this._subtotalCost = this.roundOffToFloat(this._subtotalCost);

    this._sgstCost = this.roundOff(((this._subtotalCost - discountAmount) * this._purchase.tax/2)*(0.01))
    this._cgstCost = this.roundOff(((this._subtotalCost - discountAmount) * this._purchase.tax/2)*(0.01))
    
    this._totalCost =   this.roundOff(calculateOrder(this._purchase,this._purchase.tax).totalPayable);
    this.loaded = true;

    

  })
  
 }
 roundOff(val:number){
   return val.toFixed(2);
 }
 roundOffToFloat(val: number): number {
  return parseFloat(val.toFixed(2));
}

// captureAndPrint() {
//   const element = document.getElementById('contentToConvert');
//   if (!element) return;

//   html2canvas(element, { scale: 2 }).then(canvas => {
//     const imgData = canvas.toDataURL('image/png');
//     const printWindow = window.open('', '_blank');
//     if (printWindow) {
//       printWindow.document.write('<img src="' + imgData + '" width="100%"/>');
//       printWindow.document.close();
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     }
//   });
// }


 public downloadAsPDF(htmlContent:string) {
  this.spinner.show();
  var data = document.getElementById(htmlContent);
  html2canvas(data, <any>{
    dpi: 190,
    scale: 3,scrollY: -window.scrollY,
    logging: false
  }).then(canvas => {

    const contentDataURL = canvas.toDataURL('image/png');
    let pdf = new jsPDF('p', 'mm', [58, 210]);
    
    var imgWidth = pdf.internal.pageSize.getWidth();
    let pageHeight = pdf.internal.pageSize.height;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    var position = 0;
    var whileCounter =0;
   // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    while (heightLeft >0) {
      position = heightLeft - imgHeight;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      whileCounter +=1;
      if (heightLeft>0) pdf.addPage();
    }
    pdf.autoPrint();
    const hiddFrame = document.createElement('iframe');
    hiddFrame.style.position = 'fixed';
    // "visibility: hidden" would trigger safety rules in some browsers like safari，
    // in which the iframe display in a pretty small size instead of hidden.
    // here is some little hack ~
    hiddFrame.style.width = '1px';
    hiddFrame.style.height = '1px';
    hiddFrame.style.opacity = '0.01';
    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    if (isSafari) {
      // fallback in safari
      hiddFrame.onload = () => {
        try {
          hiddFrame.contentWindow.document.execCommand('print', false, null);
        } catch (e) {
          hiddFrame.contentWindow.print();
        }
      };
    }
    hiddFrame.src = String(pdf.output('bloburl'));
    document.body.appendChild(hiddFrame);
    this.spinner.hide();
  }).catch(error => this.spinner.hide());

}

public printInvoice(htmlContent:string) {
  this.spinner.show();
  var data = document.getElementById(htmlContent);

  html2canvas(data, <any>{
    dpi: 190,
    scale: 3,
    scrollY: -window.scrollY,
    logging: false
  }).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png');
    let pdf = new jsPDF('p', 'mm', [58, 210]);

    var imgWidth = pdf.internal.pageSize.getWidth();
    let pageHeight = pdf.internal.pageSize.height;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    var position = 0;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      if (heightLeft > 0) pdf.addPage();
    }

    // Generate PDF as a Blob
    const pdfBlob = pdf.output('blob');

    // Create an object URL for the Blob
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Open in a new window and trigger print
    const newWindow = window.open(blobUrl);
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.focus();
        newWindow.print();
      };
    } else {
      console.error("Popup blocked! Allow popups for this site.");
    }

    this.spinner.hide();
  }).catch(error => {
    console.error("Error generating PDF:", error);
    this.spinner.hide();
  });
}



printDocument(){
  //this.printService.printDiv('contentToConvert');
 printJS({
   printable:'contentToConvert',
   type:'html',
   targetStyles:'[*]'});
}

}
