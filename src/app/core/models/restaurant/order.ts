import { RestaurantOrderDetail } from "./orderdetail";

export class RestaurantOrder {
    id: number;
    distributioncode: string
    sellcode: string
    selldate: string
    referencecode: string
    customercode: string
    subtotal: number
    tax: number
    punchedby: string
    punchedbyname:string
    selldetail: RestaurantOrderDetail[]
    discount: number
    note: string
    tablename: string
    attendedbyname: string
    sellstatus:string
    discountpercent: number
    
    }
    export class RestaurantOrderPayment{
        referencecode : string              
customercode : string                        
paymentmethod : string                          
paymenttype :string                         
cardnumber : string                            
paidamount :number                           
punchedby :string
tablename :string
attendedbyname :string
distributioncode : string          
sellcode :string
    }
    export function calculateOrder(order: RestaurantOrder, taxRate: number = 0): { subtotal: number, totalPayable: number } {
        let subtotal = 0;
        
        // Calculate subtotal considering individual item discount in percentage
        order.selldetail.forEach(item => {
            let itemTotal = item.quantity * item.sellprice;
            let itemDiscount = (itemTotal * item.discount) / 100;
            subtotal += (itemTotal - itemDiscount);
        });
        
        // Apply percentage discount if provided
        let totalDiscount = (subtotal * order.discountpercent) / 100;
        
        // Apply flat discount on subtotal
        totalDiscount += order.discount;
        
        let discountedTotal = subtotal - totalDiscount;
        
        // Apply tax
        let taxAmount = (discountedTotal * taxRate) / 100;
        let totalPayable = discountedTotal + taxAmount;
        
        return { subtotal, totalPayable };
    }