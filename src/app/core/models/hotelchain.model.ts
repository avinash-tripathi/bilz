
export class HotelChain {
    id:number;
    chaincode:string;
    chainname:string;
    displayprice:string;
    dafaultcurrency:string;
    
    email:string;
    phone:string;
    street1:string;
    street2:string;
    suburb:string;
    city:string;
    pincode:number;
    postcode:string;
    state:string;
    country:string;
    distributioncode:string;
    website:string;
    twitter:string;
    
    createdby:string;
    vatnumber:string;
    
    
    
    /* constructor(id: number, chaincode: string,chainname: string,displayPrice:string, dafaultcurrency:string, vatnumber:string, 
        emailAddress:string, phone:string,
        street1:string,street2:string,suburb:string,
        city:string,pincode : string, state:string,country:string,distributioncode:string

        ){
            this.id=id;
            this.chaincode=chaincode;
            this.chainname=chainname;
            this.displayprice =displayPrice;
            this.dafaultcurrency=dafaultcurrency;
            this.vatnumber=vatnumber;
            
            this.email = emailAddress;
            this.website = 'test.com';
            this.twitter = 'tw';
            this.createdby='1001'
            this.phone = phone;
            this.street1=street1;
            this.street2=street2;
            this.suburb = suburb;
            this.city=city;
            this.pincode= parseInt(pincode);
            this.state = state;
            this.country = country;
            
            this.distributioncode = distributioncode;
            
            

        } */
        toMap() {
            var map = new Map<String, any>();
            map["chainname"] = this.chainname;
            map["dafaultcurrency"] = this.displayprice;
           
            map["email"] = this.email;
            map["phone"] = this.phone;
            map["street1"] = this.street1;
            map["street2"] = this.street2;
            map["suburb"] = this.suburb;
            map["city"] = this.city;
            map["state"] = this.state;

            map["pincode"] = this.pincode;
            map["country"] = this.country;
            map["distributioncode"] = this.distributioncode;
            

           return map;
        }
}

