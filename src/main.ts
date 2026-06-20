import {parseOrders} from "./services/parsing/orders.parser.ts";
import {parseCustomer} from "./services/parsing/customers.parser.ts";
import {parseProducts} from "./services/parsing/products.parser.ts";
import {parseShippingZone} from "./services/parsing/shippingZones.parser.ts";
import {parsePromotion} from "./services/parsing/promotions.parser.ts";
import {totalsByCustomers} from "./services/customer-summary.service.ts";
import {generateReport} from "./services/generateReport.service.ts";
import path from "path";
import fs from "fs";

export function generateOrderReport() {

    const customers = parseCustomer('customers.csv');
    const products = parseProducts('products.csv')
    const shippingZones = parseShippingZone('shipping_zones.csv')
    const promotions = parsePromotion('promotions.csv')
    const orders = parseOrders('orders.csv')

    const summaries = totalsByCustomers(orders, promotions, products);

    const report = generateReport(
        summaries,
        customers,
        orders,
        products,
        shippingZones
    );

    const reportFolder = path.join(process.cwd(), "Report");

    /**
     * Génération du rapport en format texte dans le dossier "Report"
     */

    if (!fs.existsSync(reportFolder)) {
        fs.mkdirSync(reportFolder, {recursive: true});
    }

    fs.writeFileSync(
        path.join(reportFolder, "report.txt"),
        report,
        "utf-8"
    );


    console.log("Report generated successfully");
    return report;
}

generateOrderReport();