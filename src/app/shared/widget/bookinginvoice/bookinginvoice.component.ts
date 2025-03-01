import { Component, Input, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Booking } from 'src/app/core/models/booking';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { SetupDetails } from 'src/app/core/models/generalsetup.model';

@Component({
  selector: 'app-bookinginvoice',
  templateUrl: './bookinginvoice.component.html',
  styleUrls: ['./bookinginvoice.component.scss']
})
export class BookinginvoiceComponent implements OnInit {
  @Input() purchase: Booking;
  breadCrumbItems: Array<{}>;
  _purchase: Booking;
  _subtotalCost: number = 0;
  _cgsttotal: number = 0;
  _sgsttotal: number = 0;
  _totalCost: number = 0;
  _totaldays: number = 0;
  _tax:number=0;
  interState: boolean = true;
  userData: any;
  distributionData : SetupDetails
  constructor(private spinner: NgxSpinnerService, private datePipe: DatePipe,private authService: AuthenticationService,
    private commonService: CommonService) {

   }

  ngOnInit(): void {
    this.userData = JSON.parse(this.commonService.atou(sessionStorage.getItem(environment.dataKey)));
    this.distributionData = this.userData.distributiondetail;
   
    console.log(this.userData);
    this.breadCrumbItems = [{ label: 'Invoices' }, { label: 'Detail', active: true }];
    this._purchase = this.purchase;
    this._subtotalCost = 0;
    if (this.purchase.customergstnumber.length == 0) {
      this.interState = true;
    }
    else if (this.purchase.customergstnumber.length > 0 && this.purchase.customergstnumber.substring(0, 2) == "09") {
      this.interState = true;

    }
    else if (this.purchase.customergstnumber.length > 0 && this.purchase.customergstnumber.substring(0, 2) != "09") {
      this.interState = false;
    }



    this._totaldays = this._purchase.noofdays;
    if (this._purchase.featuretype == 'Room') {
      this._purchase.rooms.forEach((_p) => {
        /* this._cgsttotal = this._cgsttotal + (_p.roomrate) * (_p.gst / 2) * (0.01);
        this._sgsttotal = this._sgsttotal + (_p.roomrate) * (_p.gst / 2) * (0.01); */
        this._cgsttotal = this._cgsttotal + (_p.roomrate - this._purchase.discountpercent * (0.01) * (_p.roomrate)) * (_p.gst / 2) * (0.01);
        this._sgsttotal = this._sgsttotal + (_p.roomrate - this._purchase.discountpercent * (0.01) * (_p.roomrate)) * (_p.gst / 2) * (0.01);
        this._tax = _p.gst;

        this._subtotalCost = this._subtotalCost +
          (_p.roomrate - this._purchase.discountpercent * (0.01) * (_p.roomrate))
          + (_p.roomrate - this._purchase.discountpercent * (0.01) * (_p.roomrate)) * (_p.gst) * (0.01);


      });
      this._cgsttotal = this._cgsttotal * (this._totaldays);
      this._sgsttotal = this._sgsttotal * (this._totaldays);
      this._subtotalCost = this._subtotalCost * (this._totaldays);


      this._totalCost = Math.round(this._subtotalCost - this._purchase.bookingamount);
    }

    if (this._purchase.featuretype == 'Package') {

      let purchaseamt = 0;
      this._purchase.packageamenities.map((obj) => {
        purchaseamt = purchaseamt + obj.amenityrate * obj.quantity;
        /*  this._cgsttotal = this._cgsttotal + (obj.amenityrate * obj.quantity) * (obj.tax / 2) * (0.01);
         this._sgsttotal = this._sgsttotal + (obj.amenityrate * obj.quantity) * (obj.tax / 2) * (0.01); */
        this._cgsttotal = this._cgsttotal + ((obj.amenityrate - this._purchase.discountpercent * (0.01) * obj.amenityrate) * obj.quantity) * (obj.tax / 2) * (0.01);
        this._sgsttotal = this._sgsttotal + ((obj.amenityrate - this._purchase.discountpercent * (0.01) * obj.amenityrate) * obj.quantity) * (obj.tax / 2) * (0.01);

        this._subtotalCost = this._subtotalCost +
          (obj.amenityrate * obj.quantity - this._purchase.discountpercent * (0.01) * (obj.amenityrate * obj.quantity))
          + (obj.amenityrate * obj.quantity - this._purchase.discountpercent * (0.01) * (obj.amenityrate * obj.quantity)) * (obj.tax) * (0.01);
          this._tax = obj.tax;


      });
      this._cgsttotal = this._cgsttotal * (this._totaldays);
      this._sgsttotal = this._sgsttotal * (this._totaldays);
      this._subtotalCost = this._subtotalCost * (this._totaldays);
      this._totalCost = Math.round(this._subtotalCost - this._purchase.bookingamount);
    }





  }
  public downloadAsPDF() {
    this.spinner.show();

    var data = document.getElementById('contentToConvert');
    html2canvas(data, <any>{
      dpi: 190,
      scale: 3, scrollY: -window.scrollY,
      logging: false
    }).then(canvas => {

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');

      var imgWidth = pdf.internal.pageSize.getWidth();
      let pageHeight = pdf.internal.pageSize.height;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      var position = 0;
      var whileCounter = 0;
      // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        whileCounter += 1;
        if (heightLeft > 0) pdf.addPage();
      }
      pdf.setFontSize(8);


      // Get the height of the page
      // Get the height of one line of text in the current font size
      var lineHeight = pdf.getLineHeight();

      // Calculate the position of the bottom of the page
      var bottomOfPage = pageHeight - 1 * lineHeight;

      // Get the width of the page in millimeters
      var pageWidth = pdf.internal.pageSize.width;

      // Calculate the maximum width for the note text in millimeters
      var maxWidth = pageWidth - 20;

      // Split the text into lines that fit within the maximum width
      /* var textLines = pdf.splitTextToSize("I Agree that I am responsible for the full payment of the bill in the event it is not paid by the company, organisation or person indicated. All dispute are subject to Kannauj Juridiction.", maxWidth);
      // Write the lines of text at the bottom of the page
      var counter = 0;
      for (var i = 0; i < textLines.length; i++) {
        counter = i;
        pdf.text(textLines[i], 8, bottomOfPage + (i + 1) * lineHeight - 5);
      }
      counter = counter +1; */
      pdf.setTextColor(0, 0, 255);
      pdf.text('                                                                                     '+ this.distributionData.distributionname, 8, bottomOfPage + (+ 1) * lineHeight - 5);
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

  generatePDF() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data, <any>{
      dpi: 190,
      scale: 3,
      logging: false
    }).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      // Set the font size for the note text
      pdf.setFontSize(8);
      // Get the height of the page
      var pageHeight = pdf.internal.pageSize.height;
      // Get the height of one line of text in the current font size
      var lineHeight = pdf.getLineHeight();
      // Calculate the position of the bottom of the page
      var bottomOfPage = pageHeight - 4 * lineHeight;
      // Get the width of the page in millimeters
      var pageWidth = pdf.internal.pageSize.width;
      // Calculate the maximum width for the note text in millimeters
      var maxWidth = pageWidth - 20;

      // Split the text into lines that fit within the maximum width
      var textLines = pdf.splitTextToSize("I Agree that I am responsible for the full payment of the bill in the event it is not paid by the company, organisation or person indicated. All dispute are subject to Kannauj Juridiction.", maxWidth);
      // Write the lines of text at the bottom of the page
      var counter = 0;
      for (var i = 0; i < textLines.length; i++) {
        counter = i;
        pdf.text(textLines[i], 8, bottomOfPage + (i + 1) * lineHeight - 5);
      }
      counter = counter + 1;
      pdf.setTextColor(0, 0, 255);
      pdf.text('                                                                                     '+this.distributionData.distributionname, 8, bottomOfPage + (counter + 1) * lineHeight - 5);
      // pdf.save(this._purchase.bookingcode + '.pdf');
      var newWindow = window.open();
      newWindow.document.write(pdf.output());
      newWindow.print();
    });
  }
}
