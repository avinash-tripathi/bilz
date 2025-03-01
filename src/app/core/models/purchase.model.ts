import { Franchise } from "./franchise.model";
import { Product } from "./product";

export class Purchase {
    purchasecode:string;
    productcode: string;
    franchisecode:string;
    franchisename:string;
    franchisegstnumber:string;
    franchisestate:string;
    costtocustomer:number;
    costtofranchise:number;
    customername:string;
    customermobile:string;
    introducerdetail:Franchise;
    zipfilename:string;
    adminzipfile:string;
    adminreplydate:string;
    zipstatus:string;
    punchedby:string;
    purchasedate:string;
    products:Product[];
}
