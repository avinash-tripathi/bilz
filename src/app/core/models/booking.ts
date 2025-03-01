import { Amenity } from "./amenity";
import { Room } from "./room";

export class Booking {
    id: number;
    featuretype:string;
    bookingcode: string;
    bookingdatefrom: string;
    bookingdateto: string;
    customergstnumber: string;
    customername: string;
    customercontactno: string;
    customeraddress: string;
    customerid: string;
    customeridvalue: string;
    bookingamount: number;
    bookingstatus: string;
    createdby: string;
    distributioncode:string;
    rooms:Room[];
    packageamenities: Amenity[];
    packagecode:string;
    packagename:string;
    packageamount:number;
    status:boolean;
    checkin: string;
    checkinby: string;
    checkout: string;
    checkoutby: string;
    discountpercent: number;
    discountamount: number;
    noofguest: number;
    noofdays: number;
    paymentstatus: string;
    payment: number;
    paymentmode:string;
    companyname:string;
    invoiceno:string;


}
