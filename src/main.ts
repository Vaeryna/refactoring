import {parseCustomer} from "./services/customer.service.ts";
import path from "path";

function generateOrderReport() {
    const filesFolder = path.join(process.cwd(), 'legacy', 'legacy', 'data');

    const custPath = path.join(filesFolder, 'customers.csv');
    const ordPath = path.join(filesFolder, 'orders.csv');
    const prodPath = path.join(filesFolder, 'products.csv');
    const shipPath = path.join(filesFolder, 'shipping_zones.csv');
    const promoPath = path.join(filesFolder, 'promotions.csv');

// parseCustomer(custPath)


    console.log(parseCustomer(custPath))


}

generateOrderReport();