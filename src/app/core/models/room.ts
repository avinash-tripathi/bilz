import { Amenity } from "./amenity";

export class Room {
    id: number;
    roomcode: string;
    roomname: string;
    roomrate:number;
    gst:number;
    roomdescription: string;
    roomcategory: string;
    roomcategoryname: string;
    amenities:Amenity[];
    distributioncode:string;
    createdby:string;
    status:boolean;
}
