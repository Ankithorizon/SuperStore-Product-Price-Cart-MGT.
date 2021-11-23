import productSellHttp from "../product-sell-http-common";
import authHeader from './auth-header';

class ProductSellDataService {

    // ok
    billCreate(data) {
        return productSellHttp.post("/billCreate", data, { headers: authHeader() });
    }
}

export default new ProductSellDataService();