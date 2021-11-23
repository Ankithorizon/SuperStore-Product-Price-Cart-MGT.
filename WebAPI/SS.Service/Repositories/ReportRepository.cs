using Microsoft.EntityFrameworkCore;
using SS.Entity.Context;
using SS.Entity.Context.Models;
using SS.Service.DTO;
using SS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SS.Service.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly SSContext appDbContext;

        public ReportRepository(SSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public List<MonthlyTotalSalesData> TextReportMonthly(MonthlyTotalSalesData data)
        {
            List<MonthlyTotalSalesData> datas = new List<MonthlyTotalSalesData>();

            var selectedYear = data.SelectedYear;

            var groupedMonthly = from p in appDbContext.Payments
                          .Where(x=>x.TransactionDate.Year==Convert.ToInt32(selectedYear))
                          group p
                            by new { month = p.TransactionDate.Month } into d                            
                                 select new 
                                    { 
                                        Month = d.Key.month, 
                                        SelectedYear = selectedYear, 
                                        TotalSales = d.Sum(x => x.AmountPaid) 
                                    };

            foreach (var data_ in groupedMonthly)
            {
                datas.Add(new MonthlyTotalSalesData()
                {
                     SelectedYear = data_.SelectedYear,
                      MonthNumber = data_.Month,
                       TotalSales = data_.TotalSales                  
                });
            }

            
            var missingMonths = Enumerable
                .Range(1, 12)
                .Except(datas.Select(m => m.MonthNumber));
            // Insert missing months back into months list
            foreach (var month in missingMonths)
            {
                datas.Insert(month - 1, new MonthlyTotalSalesData()
                {
                     MonthNumber = month,
                      SelectedYear = data.SelectedYear,
                       TotalSales = 0.0M
                });
            }


            return datas;
        }

        public List<MonthlyProductWiseSalesData> TextReportMonthlyProductWise(MonthlyProductWiseSalesData data)
        {
            List<MonthlyProductWiseSalesData> datas = new List<MonthlyProductWiseSalesData>();
            List<ProductSell> productSellsData = new List<ProductSell>();

            var selectedProduct = appDbContext.Products
                                    .Include(x=>x.ProductSells)
                                    .Where(x => x.ProductId == data.SelectedProductId).FirstOrDefault();
            
            if (selectedProduct != null)
            {
                var productName = selectedProduct.ProductName;

                if (selectedProduct.ProductSells!=null && selectedProduct.ProductSells.Count() > 0)
                {                    
                    foreach (var ps in selectedProduct.ProductSells)
                    {
                        var payment = appDbContext.Payments
                                        .Where(x => x.BillRefCode == ps.BillRefCode && x.TransactionDate.Year == Convert.ToInt32(data.SelectedYear) && x.TransactionDate.Month == data.SelectedMonth).FirstOrDefault();
                        if (payment != null)
                        {
                            productSellsData.Add(ps);
                        }
                        else
                        {
                            // related payment refcode or year or month not matched
                        }
                    }

                    // group by on productSellsData
                    var groupedMonthly = from ps in productSellsData                        
                                         group ps
                                           by new { productId = ps.ProductId } into d
                                         select new
                                         {
                                             ProductId = d.Key.productId,
                                             TotalSales = d.Sum(x => (x.CurrentPrice*x.BillQty))
                                         };
                    
                    foreach (var data_ in groupedMonthly)
                    {
                        datas.Add(new MonthlyProductWiseSalesData()
                        {                            
                            TotalSales = data_.TotalSales,
                             SelectedMonth = data.SelectedMonth,
                              SelectedProductId = data.SelectedProductId,
                               SelectedProductName = productName,
                                SelectedYear = data.SelectedYear
                        });
                    }
                }
                else
                {
                    // product found
                    // but this product has 0 sales
                }                
            }
            return datas;
        }

        public List<ProductWithImageDTO> GetProductsWithImage()
        {
            List<ProductWithImageDTO> datas = new List<ProductWithImageDTO>();

            var products = appDbContext.Products;
            if(products!=null && products.Count() > 0)
            {
                foreach(var product in products)
                {
                    var productFile = appDbContext.ProductFiles
                                        .Where(x => x.ProductFileId == product.ProductFileId).FirstOrDefault();
                    if (productFile != null)
                    {
                        datas.Add(new ProductWithImageDTO()
                        {
                             ProductId = product.ProductId,
                              CurrentPrice = product.DiscountPrice==0.0M ? product.Price : product.DiscountPrice,
                               ProductName = product.ProductName,
                                ProductImage = productFile.FileName
                        });
                    }
                    else
                    {
                        // product with no image
                        datas.Add(new ProductWithImageDTO()
                        {
                            ProductId = product.ProductId,
                            CurrentPrice = product.DiscountPrice == 0.0M ? product.Price : product.DiscountPrice,
                            ProductName = product.ProductName,
                            ProductImage = "N/A"
                        });
                    }
                }                
            }
            return datas;
        }


        public List<YearlyProductWiseSalesData> TextReportYearlyProductWise(YearlyProductWiseSalesData data)
        {
            List<YearlyProductWiseSalesData> datas = new List<YearlyProductWiseSalesData>();
            List<ProductSellDTO> productSellsData = new List<ProductSellDTO>();

            var selectedProduct = appDbContext.Products
                                    .Include(x => x.ProductSells)
                                    .Where(x => x.ProductId == data.SelectedProductId).FirstOrDefault();

            var productName = "";

            if (selectedProduct != null)
            {
                productName = selectedProduct.ProductName;

                if (selectedProduct.ProductSells != null && selectedProduct.ProductSells.Count() > 0)
                {
                    foreach (var ps in selectedProduct.ProductSells)
                    {
                        var payment = appDbContext.Payments
                                        .Where(x => x.BillRefCode == ps.BillRefCode && x.TransactionDate.Year == Convert.ToInt32(data.SelectedYear)).FirstOrDefault();
                        if (payment != null)
                        {
                            productSellsData.Add(new ProductSellDTO()
                            {
                                 BasePrice = ps.BasePrice,
                                  BillDate = payment.TransactionDate,
                                   BillQty = ps.BillQty,
                                    BillRefCode = ps.BillRefCode,
                                     CurrentPrice = ps.CurrentPrice,
                                      DiscountPercentage = ps.DiscountPercentage,
                                       ProductId = ps.ProductId
                            });
                        }
                        else
                        {
                            // related payment refcode or year not matched
                        }
                    }

                    // group by on productSellsData

                    // group by with no order by 
                    /*
                    var groupedMonthly = from ps in productSellsData
                                         group ps
                                           by new { month = ps.BillDate.Month } into d
                                         select new
                                         {
                                             Month = d.Key.month,
                                             TotalSales = d.Sum(x => (x.CurrentPrice * x.BillQty))
                                         };
                    foreach (var data_ in groupedMonthly)
                    {
                        datas.Add(new YearlyProductWiseSalesData()
                        {
                            MonthNumber = data_.Month,
                            TotalSales = data_.TotalSales,
                            SelectedProductId = data.SelectedProductId,
                            SelectedProductName = productName,
                            SelectedYear = data.SelectedYear
                        });
                    }
                    */


                    // group by with order by month number
                    var query = productSellsData.GroupBy(ps => ps.BillDate.Month)
                        .Select(group =>
                            new {
                                Month = group.Key,
                                TotalSales = group.Sum(x => (x.CurrentPrice * x.BillQty)),
                                SellsData = group.OrderBy(x => x.BillDate.Month)
                            })
                        .OrderBy(group => group.SellsData.First().BillDate.Month);
                    foreach (var data_ in query)
                    {
                        datas.Add(new YearlyProductWiseSalesData()
                        {
                            MonthNumber = data_.Month,
                            TotalSales = data_.TotalSales,
                            SelectedProductId = data.SelectedProductId,
                            SelectedProductName = productName,
                            SelectedYear = data.SelectedYear
                        });
                    }
                }
                else
                {
                    // product found
                    // but this product has 0 sales
                }
            }

            var missingMonths = Enumerable
               .Range(1, 12)
               .Except(datas.Select(m => m.MonthNumber));
            // Insert missing months back into months list
            foreach (var month in missingMonths)
            {
                datas.Insert(month - 1, new YearlyProductWiseSalesData()
                {
                    SelectedProductId = data.SelectedProductId,
                    SelectedProductName = productName,
                    SelectedYear = data.SelectedYear,
                    MonthNumber = month,
                    TotalSales = 0.0M
                });
            }

            return datas;

        }

        public List<ProductDiscountSalesData> TextReportProductDiscountWise(ProductDiscountSalesData data)
        {
            List<ProductDiscountSalesData> datas = new List<ProductDiscountSalesData>();
            List<ProductSellDTO> productSellsData = new List<ProductSellDTO>();

            var selectedProduct = appDbContext.Products
                                    .Include(x => x.ProductSells)
                                    .Where(x => x.ProductId == data.SelectedProductId).FirstOrDefault();

            var productName = "";

            if (selectedProduct != null)
            {
                productName = selectedProduct.ProductName;

                if (selectedProduct.ProductSells != null && selectedProduct.ProductSells.Count() > 0)
                {
                    foreach (var ps in selectedProduct.ProductSells)
                    {
                        var payment = appDbContext.Payments
                                        .Where(x => x.BillRefCode == ps.BillRefCode && x.TransactionDate.Year == Convert.ToInt32(data.SelectedYear)).FirstOrDefault();
                        if (payment != null)
                        {
                            productSellsData.Add(new ProductSellDTO()
                            {
                                BasePrice = ps.BasePrice,
                                BillDate = payment.TransactionDate,
                                BillQty = ps.BillQty,
                                BillRefCode = ps.BillRefCode,
                                CurrentPrice = ps.CurrentPrice,
                                DiscountPercentage = ps.DiscountPercentage,
                                ProductId = ps.ProductId
                            });
                        }
                        else
                        {
                            // related payment refcode or year not matched
                        }
                    }

                    var query = productSellsData.GroupBy(ps => ps.DiscountPercentage)
                        .Select(group =>
                            new {
                                DiscountPercentage = group.Key,
                                TotalSales = group.Sum(x => (x.CurrentPrice * x.BillQty))
                            });
                    foreach (var data_ in query)
                    {
                        datas.Add(new ProductDiscountSalesData()
                        {
                            DiscountPercentage = data_.DiscountPercentage,
                            TotalSales = data_.TotalSales,
                            SelectedProductId = data.SelectedProductId,
                            SelectedProductName = productName,
                            SelectedYear = data.SelectedYear
                        });
                    }
                }
                else
                {
                    // product found
                    // but this product has 0 sales
                }
            }
            return datas;
        }
    }
}
