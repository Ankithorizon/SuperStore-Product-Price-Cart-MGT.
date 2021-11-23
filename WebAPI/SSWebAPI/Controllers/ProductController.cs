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
    
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepo;

        public ProductController(IProductRepository productRepo)
        {
            _productRepo = productRepo;
        }   
        
        [Authorize("Admin")]
        [HttpPost]
        [Route("addProduct")]
        public IActionResult AddProduct(Product product)
        {
            try
            {
                // throw new Exception();

                if (ModelState.IsValid)
                {
                    _productRepo.AddProduct(product);
                    return Ok("Product Created Successfully !");
                }
                else
                {
                    // return BadRequest(ModelState);
                    return BadRequest(ModelState.ToDictionary(
                         kvp => kvp.Key,
                         kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                       ));
                }              
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        [RequestSizeLimit(40000000)]
        [Route("productFileUpload")]
        public IActionResult ProductFileUpload()
        {
            ProductFileAddResponse response = new ProductFileAddResponse();
            try
            {
                // throw new Exception();

                var postedFile = Request.Form.Files[0];
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Files");
                if (postedFile.Length > 0)
                {
                    var fileName = DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + "-" + DateTime.Now.Hour + "-" + DateTime.Now.Minute + "-" + postedFile.FileName;
                    var finalPath = Path.Combine(uploadFolder, fileName);
                    using (var fileStream = new FileStream(finalPath, FileMode.Create))
                    {
                        postedFile.CopyTo(fileStream);
                    }
                    // product file info save to db
                    ProductFile productFile = new ProductFile()
                    {
                        FilePath = finalPath,
                        FileName = fileName
                    };
                    response = _productRepo.ProductFileAdd(productFile);
                    return Ok(response);
                }
                else
                {
                    return BadRequest("The File is not received.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Some Error Occcured while uploading File {ex.Message}");
            }
        }
        /*
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [RequestSizeLimit(40000000)]
        [Route("productFileUpload")]
        public IActionResult ProductFileUpload()
        {
            ProductFileAddResponse response = new ProductFileAddResponse();
            try
            {
                // throw new Exception();

                var postedFile = Request.Form.Files[0];
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Files");
                if (postedFile.Length > 0)
                {
                    var fileName = DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + "-" + DateTime.Now.Hour + "-" + DateTime.Now.Minute + "-" + ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition)
                        .FileName.Trim('"');
                    var finalPath = Path.Combine(uploadFolder, fileName);
                    using (var fileStream = new FileStream(finalPath, FileMode.Create))
                    {
                        postedFile.CopyTo(fileStream);
                    }
                    // return Ok($"File is uploaded Successfully");

                    // product file info save to db
                    ProductFile productFile = new ProductFile()
                    {
                        FilePath = finalPath,
                        FileName = fileName
                    };
                    response = _productRepo.ProductFileAdd(productFile);
                    return Ok(response);
                }
                else
                {
                    return BadRequest("The File is not received.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Some Error Occcured while uploading File {ex.Message}");
            }
        }
        */

        [Authorize(Roles = "CSUser,Admin,Manager")]        
        [HttpGet]
        [Route("allProducts")]
        public IActionResult GetAllProducts(string searchValue, string categoryId)
        {
            try
            {
                /*
                if (!String.IsNullOrEmpty(searchValue) || !String.IsNullOrEmpty(categoryId))
                */

                if (searchValue==null && categoryId == null )                
                {
                    var allProducts = _productRepo.GetAllProducts();
                    return Ok(allProducts);
                }
                else
                {
                    var allProducts = _productRepo.SearchProducts(searchValue, categoryId);
                    return Ok(allProducts);
                }
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }


        [Authorize(Roles = "Admin,Manager")]
        [HttpGet]
        [Route("getProduct/{selectedProductId}")]
        public IActionResult GetProduct(int selectedProductId)
        {
            try
            {
                // throw new Exception();

                var product = _productRepo.GetProduct(selectedProductId);

                if (product == null)
                {
                    return BadRequest();
                }
                else if (product.ProductId == 0)
                {
                    // return Ok("Product Not Found !");
                    return BadRequest("Product Not Found !");
                }
                else
                {
                    return Ok(product);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Server Exception !");
            }
        }

        [Authorize("Admin")]
        [HttpPost]
        [Route("editProduct/{editingProductId}")]
        public IActionResult EditProduct(int editingProductId, ProductDTO product)
        {
            APIResponse response = new APIResponse();
            try
            {
                // check for null
                if (product == null)
                {
                    return BadRequest();
                }

                // check for exception
                // throw new Exception();

                ProductDTO editedProduct = _productRepo.EditProduct(product);
                if (editedProduct != null)
                {
                    response.ResponseCode = 0;
                    response.ResponseMessage = "Product Edited Successfully !";
                    return Ok(response);
                }
                else
                {
                    response.ResponseCode = -2;
                    response.ResponseMessage = "Server Error !";
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                response.ResponseCode = -2;
                response.ResponseMessage = "Server Error !";
                return BadRequest(response);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [RequestSizeLimit(40000000)]
        [Route("editProductFileUpload")]
        public IActionResult EditProductFileUpload(IFormCollection data)
        {
            ProductFileEditResponse response = new ProductFileEditResponse();
            int ProductFileId = 0;
            int ProductId = 0;
            // int ProductFileId = 1;
            try
            {
                // throw new Exception();    
                var files = data.Files;
                
                if (data.TryGetValue("productFileId", out var _productFileId))
                {
                    ProductFileId = Int32.Parse(_productFileId);
                }
                if (data.TryGetValue("productId", out var _productId))
                {
                    ProductId = Int32.Parse(_productId);
                }

                var postedFile = files[0];
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Files");

                // check for 400
                // if (!(postedFile.Length > 0))

                if (postedFile.Length > 0)
                {

                    // check for 500
                    // throw new Exception();

                    var fileName = DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + "-" + DateTime.Now.Hour + "-" + DateTime.Now.Minute + "-" + postedFile.FileName;
                    var finalPath = Path.Combine(uploadFolder, fileName);
                    using (var fileStream = new FileStream(finalPath, FileMode.Create))
                    {
                        postedFile.CopyTo(fileStream);
                    }
                    // return Ok($"File is uploaded Successfully");

                    
                    // product file info
                    ProductFile productFile = new ProductFile()
                    {
                        FilePath = finalPath,
                        FileName = fileName
                    };

                    // product file info edit/add to db
                    ProductFileEditResponse _productFile = new ProductFileEditResponse()
                    {
                        ProductId = ProductId,
                        ProductFileId = ProductFileId,
                        ProductImage = productFile.FileName,
                        ProductImagePath = productFile.FilePath
                    };
                    response = _productRepo.ProductFileEdit(_productFile);
                    return Ok(response);
                }
                else
                {
                    return BadRequest("The File is not received.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Some Error Occcured while uploading File {ex.Message}");
            }
        }
        /*
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [RequestSizeLimit(40000000)]
        [Route("editProductFileUpload")]
        public IActionResult EditProductFileUpload(IFormCollection data)
        {
            ProductFileEditResponse response = new ProductFileEditResponse();
            int ProductFileId = 0;
            try
            {
                // throw new Exception();    
                var files = data.Files;
                if (data.TryGetValue("productFileId", out var _productFileId))
                {
                    ProductFileId = Int32.Parse(_productFileId);
                }

                var postedFile = Request.Form.Files[0];
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Files");
                if (postedFile.Length > 0)
                {
                    var fileName = DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + "-" + DateTime.Now.Hour + "-" + DateTime.Now.Minute + "-" + ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition)
                        .FileName.Trim('"');
                    var finalPath = Path.Combine(uploadFolder, fileName);
                    using (var fileStream = new FileStream(finalPath, FileMode.Create))
                    {
                        postedFile.CopyTo(fileStream);
                    }
                    // return Ok($"File is uploaded Successfully");

                    // product file info
                    ProductFile productFile = new ProductFile()
                    {
                        FilePath = finalPath,
                        FileName = fileName
                    };

                    // product file info edit/add to db
                    ProductFileEditResponse _productFile = new ProductFileEditResponse()
                    {
                        ProductFileId = ProductFileId,
                        ProductImage = productFile.FileName,
                        ProductImagePath = productFile.FilePath
                    };
                    response = _productRepo.ProductFileEdit(_productFile);
                    return Ok(response);
                }
                else
                {
                    return BadRequest("The File is not received.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Some Error Occcured while uploading File {ex.Message}");
            }
        }
        */

        [Authorize(Roles = "CSUser,Admin,Manager")]
        [HttpGet]
        [Route("getCategories")]
        public IActionResult GetCategories()
        {
            try
            {
                // throw new Exception();
                var _categories = _productRepo.GetCategories();
                return Ok(_categories);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // apply discount
        [Authorize("Manager")]
        [HttpPost]
        [Route("setProductDiscount")]
        public IActionResult SetProductDiscount(ProductDiscountDTO discount)
        {
            try
            {
                // throw new Exception();

                if (ModelState.IsValid)
                {
                    discount = _productRepo.SetProductDiscount(discount);
                    return Ok(discount);
                }
                else
                {
                    // return BadRequest(ModelState);
                    return BadRequest(ModelState.ToDictionary(
                         kvp => kvp.Key,
                         kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                       ));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
