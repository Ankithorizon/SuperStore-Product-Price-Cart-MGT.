import productHttp from "../product-http-common";
import authHeader from './auth-header';

class ProductDataService {

    // ok
    create(data) {
        return productHttp.post("/addProduct", data, { headers: authHeader() });
    }
    
    // ok
    getProductImage(productFileId) {
        return productHttp.get(`/getProductImage/${productFileId}`, { headers: authHeader() });
    }

    // ok
    getAll() {
        return productHttp.get("/allProducts", { headers: authHeader() });
    }

    // ok
    get(selectedProductId) {
        return productHttp.get(`/getProduct/${selectedProductId}`, { headers: authHeader() });
    }

    // ok
    edit(editingProductId, data) {
        return productHttp.post(`/editProduct/${editingProductId}`, data, { headers: authHeader() });
    }

    // ok
    getCategories() {
        return productHttp.get("/getCategories", { headers: authHeader() });
    }

    // ok
    findingProduct(pName, categoryId) {
        return productHttp.get(`/allProducts?searchValue=${pName}&categoryId=${categoryId}`, { headers: authHeader() });
    }

    // ok
    setProductDiscount(data) {
        console.log(authHeader());
        return productHttp.post("/setProductDiscount", data, { headers: authHeader() });
    }
}

export default new ProductDataService();