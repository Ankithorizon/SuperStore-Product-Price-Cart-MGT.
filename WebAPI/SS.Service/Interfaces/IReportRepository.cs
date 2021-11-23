using SS.Entity.Context.Models;
using SS.Service.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace SS.Service.Interfaces
{
    public interface IReportRepository
    {
        List<MonthlyTotalSalesData> TextReportMonthly(MonthlyTotalSalesData data);
        List<MonthlyProductWiseSalesData> TextReportMonthlyProductWise(MonthlyProductWiseSalesData data);
        List<ProductWithImageDTO> GetProductsWithImage();
        List<YearlyProductWiseSalesData> TextReportYearlyProductWise(YearlyProductWiseSalesData data);
        List<ProductDiscountSalesData> TextReportProductDiscountWise(ProductDiscountSalesData data);
    }
}
