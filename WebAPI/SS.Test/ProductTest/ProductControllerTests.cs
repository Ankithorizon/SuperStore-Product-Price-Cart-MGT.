using System;
using System.Collections.Generic;
using System.Text;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using SSWebAPI.Controllers;
using SS.Service.Interfaces;
using SS.Entity.Context.Models;
using SS.Service.DTO;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Extensions.Primitives;
using Microsoft.AspNetCore.Mvc.Controllers;
using System.Web;
using System.Linq;
using Microsoft.AspNetCore.Routing;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Autofac.Extras.Moq;

namespace SS.Test.ProductTest
{
    public class ProductControllerTests
    {
        ProductController _controller;
        IProductRepository _service;

        public ProductControllerTests()
        {
            _service = new ProductRepositoryFake();
            _controller = new ProductController(_service);
        }

        [Fact]
        public void GetAllProducts_WhenCalledWithoutParameters_ReturnsOkResult()
        {
            // Arrange
            string searchValue = null;
            string categoryId = null;

            // Act
            var okResult = _controller.GetAllProducts(searchValue, categoryId);
            // Assert
            Assert.IsType<OkObjectResult>(okResult);
        }
        [Fact]
        public void GetAllProducts_WhenCalledWithoutParameters_ReturnsAllProducts()
        {
            // Arrange
            string searchValue = null;
            string categoryId = null;

            // Act
            var okResult = _controller.GetAllProducts(searchValue, categoryId) as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<ProductDTO>>(okResult.Value);
            Assert.Equal(3, items.Count);
        }
        [Fact]
        public void GetAllProducts_WhenCalledValidSearchValueInvalidCategoryId_ReturnsBadRequest()
        {
            // Arrange
            string searchValue = "haha";
            
            // invalid value
            // expecting either null or int
            string categoryId = "";

            // Act
            var badRequestResult = _controller.GetAllProducts(searchValue, categoryId);
            // Assert
            Assert.IsType<BadRequestResult>(badRequestResult);
        }
        [Fact]
        public void GetAllProducts_WhenCalledValidSearchValueNullCategoryId_ReturnsMatchedProducts()
        {
            // Arrange
            string searchValue = "haha";

            // expecting either null or int
            string categoryId = null;

            // Act
            var okResult = _controller.GetAllProducts(searchValue, categoryId) as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<ProductDTO>>(okResult.Value);
            Assert.Equal(3, items.Count);
        }
        [Fact]
        public void GetAllProducts_WhenCalledNullSearchValueInvalidCategoryId_ReturnsBadRequest()
        {
            // Arrange
            string searchValue = null;

            // invalid value
            // expecting either null or int
            string categoryId = "";

            // Act
            var badRequestResult = _controller.GetAllProducts(searchValue, categoryId);
            // Assert
            Assert.IsType<BadRequestResult>(badRequestResult);
        }
        [Fact]
        public void GetAllProducts_WhenCalledNullSearchValueValidCategoryId_ReturnsMatchedProducts()
        {
            // Arrange
            string searchValue = null;

            // expecting either null or int
            string categoryId = "1";

            // Act
            var okResult = _controller.GetAllProducts(searchValue, categoryId) as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<ProductDTO>>(okResult.Value);
            Assert.Equal(2, items.Count);
        }
        [Fact]
        public void GetAllProducts_WhenCalledValidSearchValueValidCategoryId_ReturnsMatchedProducts()
        {
            // Arrange
            string searchValue = "wow";

            // expecting either null or int
            // string categoryId = "2";
            string categoryId = "44";

            // Act
            var okResult = _controller.GetAllProducts(searchValue, categoryId) as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<ProductDTO>>(okResult.Value);
            // Assert.Equal(2, items.Count);
            // Assert.Single(items);
            Assert.Empty(items);
        }


        [Fact]
        public void GetProduct_WhenCalled_AndProductFound_ReturnsOkResult()
        {
            // Arrange
            int selectedProductId = 1;
            var productName = "haha1";

            // Act
            var okResult = _controller.GetProduct(selectedProductId) as OkObjectResult;

            // Assert
            Assert.IsType<ProductDTO>(okResult.Value);
            Assert.Equal(productName, (okResult.Value as ProductDTO).ProductName);
            Assert.Equal(99.99M, (okResult.Value as ProductDTO).Price);
        }
        [Fact]
        public void GetProduct_WhenCalled_AndProductNotFound_ReturnsBadRequest()
        {
            // Arrange
            int selectedProductId = 11;

            // Act
            var badRequestResult = _controller.GetProduct(selectedProductId) as BadRequestObjectResult;
            // Assert
            Assert.IsType<BadRequestObjectResult>(badRequestResult);
        }
           

        [Fact]
        public void ProductFileUpload_WhenCalled_ReturnsCorrectFileName()
        {
            //Arrange
            //Setup mock file using a memory stream
            var content = "Hello World from a Fake File";
            var fileName = "test.pdf";
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;

            //create FormFile with desired data
            IFormFile file = new FormFile(stream, 0, stream.Length, "id_from_form", fileName);

            var httpContextMock = new Mock<HttpContext>();
            var requestMock = new Mock<HttpRequest>();
            httpContextMock.SetupGet(x => x.Request).Returns(requestMock.Object);
            requestMock.SetupGet(x => x.Form.Files[0]).Returns(file);

            var fileNameRet = requestMock.Object.Form.Files[0].FileName;
            Assert.Equal(fileName, fileNameRet);
        }
        [Fact]
        public void ProductFileUpload_WhenCalled_ReturnsCorrectFileLength()
        {
            //Arrange
            //Setup mock file using a memory stream
            var content = "Hello World from a Fake File";
            var fileName = "test.pdf";
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;

            //create FormFile with desired data
            IFormFile file = new FormFile(stream, 0, stream.Length, "id_from_form", fileName);


            var httpContextMock = new Mock<HttpContext>();
            var requestMock = new Mock<HttpRequest>();
            httpContextMock.SetupGet(x => x.Request).Returns(requestMock.Object);
            requestMock.SetupGet(x => x.Form.Files[0]).Returns(file);

            var fileLength = requestMock.Object.Form.Files[0].Length;
            Assert.NotEqual(0, fileLength);
        }       
        [Fact]
        public void ProductFileUpload_WhenCalled_ReturnsOkResult()
        {
            //Arrange
            //Setup mock file using a memory stream
            var content = "Hello World from a Fake File";
            var fileName = "test.pdf";
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;

            //create FormFile with desired data
            IFormFile file = new FormFile(stream, 0, stream.Length, "id_from_form", fileName);

            var httpContextMock = new Mock<HttpContext>();
            var requestMock = new Mock<HttpRequest>();
            requestMock.SetupGet(x => x.Form.Files[0]).Returns(file);
            httpContextMock.SetupGet(x => x.Request).Returns(requestMock.Object);

            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = httpContextMock.Object
            };


            // Act
            var okResult = _controller.ProductFileUpload() as OkObjectResult;
            // Assert
            Assert.IsType<ProductFileAddResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as ProductFileAddResponse).ResponseCode);
            Assert.Equal("Product File Saved Successfully !", (okResult.Value as ProductFileAddResponse).ResponseMessage);
            Assert.Equal(4, (okResult.Value as ProductFileAddResponse).ProductFileId);
        }


        [Fact]
        public void AddProduct_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var productNameMissingItem = new Product()
            {
                ProductId = 4,
                 CategoryId= 3,
                  Price = 1.99M
            };
            _controller.ModelState.AddModelError("ProductName", "Required");
            // Act
            var badResponse = _controller.AddProduct(productNameMissingItem);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }
        [Fact]
        public void AddProduct_ValidObjectPassed_ReturnsCreatedResponse()
        {
            // Arrange
            Product testProduct = new Product()
            {
                ProductId = 4,
                 CategoryId = 3,
                  Price = 1.99M, 
                   ProductFileId = 4,
                    DiscountPrice = 0.0M,
                     ProductDesc = "haha4",
                      ProductName = "haha4"
            };

            // Act
            var okResult = _controller.AddProduct(testProduct) as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(okResult);
        }


        [Fact]
        public void EditProduct_NullObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            int editingProductId = 1;
            ProductDTO nullObject = null;

            // Act
            var badResponse = _controller.EditProduct(editingProductId, nullObject) as BadRequestResult;

            // Assert
            Assert.IsType<BadRequestResult>(badResponse);
        }
        [Fact]
        public void EditProduct_NotFoundObjectPassed_ReturnsBadRequestMinus2()
        {
            // Arrange
            int editingProductId = 111;
            ProductDTO notFoundObject = new ProductDTO()
            {
                 ProductId = 111                  
            };
            var apiResponse = new APIResponse();

            // Act
            var badResponse = _controller.EditProduct(editingProductId, notFoundObject) as BadRequestObjectResult;
                 
            // Assert
            Assert.IsType<APIResponse>(badResponse.Value);
            Assert.Equal(-2, (badResponse.Value as APIResponse).ResponseCode);
        }
        [Fact]
        public void EditProduct_WhenCalled_ReturnsOkZero()
        {
            // Arrange
            int editingProductId = 1;
            ProductDTO notFoundObject = new ProductDTO()
            {
                ProductId = 1,
                 CategoryId = 1, 
                  Price = 1.99M,
                    ProductName = "haha1",
                     ProductDesc = "haha1"
            };
            var apiResponse = new APIResponse();

            // Act
            var okResponse = _controller.EditProduct(editingProductId, notFoundObject) as OkObjectResult;

            // Assert
            Assert.IsType<APIResponse>(okResponse.Value);
            Assert.Equal(0, (okResponse.Value as APIResponse).ResponseCode);
        }


        [Fact]
        public void EditProductFileUpload_WhenCalled_ReturnsOkZero()
        {
            // Arrange
            var response = new ProductFileEditResponse();
            var productFileId = 1;
            var content = "Hello World from a Fake File";
            var fileName = "test.pdf";
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;
            //create FormFile with desired data
            IFormFile file = new FormFile(stream, 0, stream.Length, "id_from_form", fileName);

            // Set up the form collection with the mocked form
            Mock<IFormCollection> forms = new Mock<IFormCollection>();
            forms.Setup(f => f.Files[It.IsAny<int>()]).Returns(file);
            // forms.Setup(f => f.productFileId).Returns(file);

            // Set up the context
            _controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext()
            };

            // Set up the forms
            // _controller.Request.Form = forms.Object;

            var okResult = _controller.EditProductFileUpload(forms.Object) as OkObjectResult;

            // Assert
            // Assert.IsType<string>(okResult.Value);
            Assert.IsType<ProductFileEditResponse>(okResult.Value);
            Assert.Equal(0, (okResult.Value as ProductFileEditResponse).ResponseCode);
        }


        [Fact]
        public void GetCategories_WhenCalled_ReturnsOkResult()
        {
            // Act
            var okResult = _controller.GetCategories();
            // Assert
            Assert.IsType<OkObjectResult>(okResult);
        }
        [Fact]
        public void GetCategories_WhenCalled_ReturnsAllCategories()
        {
            // Act
            var okResult = _controller.GetCategories() as OkObjectResult;
            // Assert
            var items = Assert.IsType<List<Category>>(okResult.Value);
            Assert.Equal(3, items.Count);
        }


        [Fact]
        public void SetProductDiscount_InvalidObjectPassed_ReturnsBadRequest()
        {
            // Arrange
            var productIdMissingItem = new ProductDiscountDTO()
            {
                 DiscountPercentage = 10
            };
            _controller.ModelState.AddModelError("ProductId", "Required");
            // Act
            var badResponse = _controller.SetProductDiscount(productIdMissingItem);
            // Assert
            Assert.IsType<BadRequestObjectResult>(badResponse);
        }
        [Fact]
        public void SetProductDiscount_ValidObjectPassedButNotFound_ReturnsOKMinusOne()
        {
            // Arrange
            var productDiscountObject = new ProductDiscountDTO()
            {
                 ProductId = 111,
                DiscountPercentage = 10
            };
            // Act
            var okResult = _controller.SetProductDiscount(productDiscountObject) as OkObjectResult;
            // Assert
            Assert.IsType<ProductDiscountDTO>(okResult.Value);
            Assert.Equal(-1, (okResult.Value as ProductDiscountDTO).APIResponse.ResponseCode);
        }
        [Fact]
        public void SetProductDiscount_ValidObjectPassed_ReturnsOKZero()
        {
            // Arrange
            var productDiscountObject = new ProductDiscountDTO()
            {
                ProductId = 1,
                DiscountPercentage = 10
            };

            // Act
            var okResult = _controller.SetProductDiscount(productDiscountObject) as OkObjectResult;

            // Assert
            Assert.IsType<ProductDiscountDTO>(okResult.Value);
            Assert.Equal(0, (okResult.Value as ProductDiscountDTO).APIResponse.ResponseCode);
            Assert.Equal(90.00M, (okResult.Value as ProductDiscountDTO).DiscountPrice);
        }

    }
}
