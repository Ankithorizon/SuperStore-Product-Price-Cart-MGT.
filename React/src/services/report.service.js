import reportHttp from "../report-http-common";
import authHeader from './auth-header';

class ReportDataService {

    // ok
    textReportMonthly(data) {
        return reportHttp.post("/textReportMonthly", data, { headers: authHeader() });
    }

    // ok
    textReportMonthlyProductWise(data) {
        return reportHttp.post("/textReportMonthlyProductWise", data, { headers: authHeader() });
    }

    // ok
    getProductsWithImage() {
        return reportHttp.get("/productsWithImage", { headers: authHeader() });
    }

    // ok
    textReportYearlyProductWise(data) {
        return reportHttp.post("/textReportYearlyProductWise", data, { headers: authHeader() });
    }

    // ok
    textReportProductDiscountWise(data) {
        return reportHttp.post("/textReportProductDiscountWise", data, { headers: authHeader() });
    }
}

export default new ReportDataService();