import { PackageFeature } from "./packagefeature";

export class Package {
    id: number;
    packagecode: string;
    packagename: string;
    packageamount: number;
    packagefeatures:PackageFeature[];
    createdby: string;
    distributioncode: string;
   
    
}