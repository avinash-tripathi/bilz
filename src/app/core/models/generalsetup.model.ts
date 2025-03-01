
export class SetupDetails {
    id:number;
    distributionname:string;
    displayPrice:string;
    dafaultcurrency:string;
    lastname:string;
    firstname:string;
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
    permanentstreet1:string;
    permanentstreet2:string;
    permanentsuburb:string;
    permanentcity:string;
    permanentstate:string;
    permanentpostcode:string;
    permanentcountry:string;
    punchedby:string;
    vatnumber:string;
    restauranttax:number;
    includekot:boolean;
    enablenegativeinventory:boolean;
    
    
    constructor(id: number, distributionName: string,displayPrice:string, dafaultcurrency:string, vatnumber:string, 
        firstname: string,lastname: string,emailAddress:string, phone:string,
        street1:string,street2:string,suburb:string,
        city:string,pincode : string, state:string,country:string,distributioncode:string,
        restauranttax:number,
        includekot:boolean,
        enablenegativeinventory:boolean

        ){
            this.id=id;
            this.distributionname=distributionName;
            this.displayPrice =displayPrice;
            this.dafaultcurrency=dafaultcurrency;
            this.vatnumber=vatnumber;
            this.firstname=firstname;
            this.lastname=lastname;
            this.email = emailAddress;
            this.website = 'test.com';
            this.twitter = 'tw';
            this.punchedby='1001'
            this.phone = phone;
            this.street1=street1;
            this.street2=street2;
            this.suburb = suburb;
            this.city=city;
            this.pincode= parseInt(pincode);
            this.state = state;
            this.country = country;
            this.permanentstreet1=street1;
            this.permanentstreet2=street2;
            this.permanentsuburb = suburb;
            this.permanentcity=city;
            this.permanentpostcode= '';
            this.permanentstate = state;
            this.permanentcountry = country;
            this.distributioncode = distributioncode;
            this.restauranttax = restauranttax;
            this.includekot = includekot;
            this.enablenegativeinventory = enablenegativeinventory;
            

        }
        toMap() {
            var map = new Map<String, any>();
            map["distributionname"] = this.distributionname;
            map["dafaultcurrency"] = this.displayPrice;
            map["firstname"] = this.firstname;
            map["lastname"] = this.lastname;
            map["email"] = this.email;
            map["phone"] = this.phone;
            map["street1"] = this.street1;
            map["street2"] = this.street2;
            map["suburb"] = this.suburb;
            map["city"] = this.city;
            map["state"] = this.state;

            map["pincode"] = this.pincode;
            map["country"] = this.country;
            map["restauranttax"] = this.restauranttax;
            map["includekot"] = this.includekot;
            //map["distributioncode"] = this.distributioncode;
            map["enablenegativeinventory"] = this.enablenegativeinventory;

           return map;
        }
}

export class SavedistributionUpdate {
    distributionname: string;
    displayprice: string;
    dafaultcurrency: string;
    vatnumber: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    website: string;
    twitter: string;
    street1: string;
    street2: string;
    suburb: string;
    city: string;
    pincode: number;
    state: string;
    country: string;
    permanentstreet1: string;
    permanentstreet2: string;
    permanentsuburb: string;
    permanentcity: string;
    permanentstate: string;
    permanentpostcode: number;
    permanentcountry: string;
    punchedby: string;
    distributioncode: string;

}
export class Savedistribution {
    distributionname: string;
    displayprice: string;
    dafaultcurrency: string;
    vatnumber: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    street1: string;
    street2: string;
    suburb: string;
    city: string;
    pincode: number;
    state: string;
    country: string;
    website: string;
    twitter: string;
    permanentstreet1: string;
    permanentstreet2: string;
    permanentsuburb: string;
    permanentcity: string;
    permanentstate: string;
    permanentpostcode: number;
    permanentcountry: string;
    punchedby: string;
}