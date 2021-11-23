using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SS.Entity.Context.Models;
using SS.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http.Headers;
using SS.Service.DTO;
using Microsoft.AspNetCore.Authorization;

namespace SSWebAPI.Controllers
{
    [Authorize("Manager")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _reportRepo;

        public ReportController(IReportRepository reportRepo)
        {
            _reportRepo = reportRepo;
        }

        [HttpPost]
        [Route("textReportMonthly")]
        public IActionResult TextReportMonthly(MonthlyTotalSalesData data)
        {
            try
            {
                List<MonthlyTotalSalesData> datas = _reportRepo.TextReportMonthly(data);
                return Ok(datas);
            }
            catch(Exception ex)
            {
                return BadRequest("Invalid Data !");
            }        
        }

        [HttpPost]
        [Route("textReportMonthlyProductWise")]
        public IActionResult TextReportMonthlyProductWise(MonthlyProductWiseSalesData data)
        {
            try
            {
                List<MonthlyProductWiseSalesData> datas = _reportRepo.TextReportMonthlyProductWise(data);
                return Ok(datas);
            }
            catch(Exception ex)
            {
                return BadRequest("Invalid Data !");
            }         
        }

        [HttpGet]
        [Route("productsWithImage")]
        public IActionResult GetProductsWithImage()
        {
            try
            {
                var allProducts = _reportRepo.GetProductsWithImage();
                return Ok(allProducts);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("textReportYearlyProductWise")]
        public IActionResult TextReportYearlyProductWise(YearlyProductWiseSalesData data)
        {
            try
            {
                List<YearlyProductWiseSalesData> datas = _reportRepo.TextReportYearlyProductWise(data);
                return Ok(datas);
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid Data !");
            }
        }

        [HttpPost]
        [Route("textReportProductDiscountWise")]
        public IActionResult TextReportProductDiscountWise(ProductDiscountSalesData data)
        {
            try
            {
                List<ProductDiscountSalesData> datas = _reportRepo.TextReportProductDiscountWise(data);
                return Ok(datas);
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid Data !");
            }
        }

    }
}
