using SS.Entity.Context.Models;
using SS.Service.DTO;
using SS.Service.Interfaces;
using SS.Service.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SS.Test.ProductTest
{
    public class ProductRepositoryFake : IProductRepository
    {
        private readonly List<Product> _products_;
        private readonly List<ProductFile> _productFiles_;
        private readonly List<Category> _categories_;
        public ProductRepositoryFake()
        {
            _categories_ = new List<Category>() {
                new Category()
                {
                     CategoryId = 1,
                      CategoryName = "Grocery"
                },
                  new Category()
                {
                     CategoryId = 2,
                      CategoryName = "Frozen"
                },
                    new Category()
                {
                     CategoryId = 3,
                      CategoryName = "Bakery"
                }
            };

            _productFiles_ = new List<ProductFile>()
            {
                new ProductFile() {
                     ProductFileId =1,
                      FileName = "haha1.png",
                       FilePath = "c:\\Files\\haha1.png"                    
                },
                new ProductFile() {
                     ProductFileId =2,
                      FileName = "haha2.png",
                       FilePath = "c:\\Files\\haha2.png"
                },
                 new ProductFile() {
                     ProductFileId =3,
                      FileName = "haha3.png",
                       FilePath = "c:\\Files\\haha3.png"
                }
            };

            _products_ = new List<Product>()
            {
                new Product() { 
                     CategoryId = 1,
                      Price = 100.00M,
                       ProductDesc = "haha desc -1",
                        ProductId = 1,
                         ProductName = "haha1",
                          ProductFileId = 1,
                           DiscountPrice = 0.0M
                },
                 new Product() {
                     CategoryId = 1,
                      Price = 999.99M,
                       ProductDesc = "haha desc -2",
                        ProductId = 2,
                         ProductName = "haha2",
                          ProductFileId= 2,
                          DiscountPrice = 0.0M
                },
                  new Product() {
                     CategoryId = 2,
                      Price = 9.99M,
                       ProductDesc = "haha desc -3",
                        ProductId = 3,
                         ProductName = "haha3",
                          ProductFileId = 3,
                          DiscountPrice = 0.0M
                }
            };
        }

        public Product AddProduct(Product product)
        {
            _products_.Add(product);
            return product;
        }

        public ProductFileAddResponse ProductFileAdd(ProductFile productFile)
        {
            ProductFileAddResponse response = new ProductFileAddResponse();
            try
            {
                // throw new Exception();

                _productFiles_.Add(productFile);
                response.ResponseCode = 0;
                response.ResponseMessage = "Product File Saved Successfully !";
                response.ProductFileId = 4;
                response.ProductImage = productFile.FileName;
            }
            catch (Exception ex)
            {
                response.ResponseCode = -1;
                response.ResponseMessage = "Product File Saved Fail !";
                response.ProductFileId = 0;
                response.ProductImage = null;
            }
            return response;
        }

        public IEnumerable<ProductDTO> GetAllProducts()
        {
            // throw new NotImplementedException();
            List<ProductDTO> products = new List<ProductDTO>();
            var _products = _products_;

            if (_products != null && _products.Count() > 0)
            {
                foreach (var _product in _products)
                {
                    var _productImage = _productFiles_
                                        .Where(x => x.ProductFileId == _product.ProductFileId).FirstOrDefault();
                    if (_productImage != null)
                    {
                        // products with image
                        products.Add(new ProductDTO()
                        {
                            CategoryId = _product.CategoryId,
                            Price = _product.Price,
                            ProductDesc = _product.ProductDesc,
                            ProductFileId = _product.ProductFileId,
                            ProductId = _product.ProductId,
                            ProductImage = _productImage.FileName,
                            ProductName = _product.ProductName,
                            CurrentPrice = _product.DiscountPrice > 0 ? _product.DiscountPrice : _product.Price
                        });
                    }
                    else
                    {
                        // products without image
                        products.Add(new ProductDTO()
                        {
                            CategoryId = _product.CategoryId,
                            Price = _product.Price,
                            ProductDesc = _product.ProductDesc,
                            ProductId = _product.ProductId,
                            ProductImage = null,
                            ProductName = _product.ProductName,
                            CurrentPrice = _product.DiscountPrice > 0 ? _product.DiscountPrice : _product.Price
                        });
                    }
                }
            }
            return products;
        }

        public ProductDTO GetProduct(int productId)
        {
            ProductDTO product = new ProductDTO();

            var _product = _products_
                                .Where(x => x.ProductId == productId).FirstOrDefault();
            if (_product != null)
            {
                var _productFile = _productFiles_
                                        .Where(x => x.ProductFileId == _product.ProductFileId).FirstOrDefault();

                // product with image
                if (_productFile != null)
                {
                    product.CategoryId = _product.CategoryId;
                    product.Price = _product.Price;
                    product.ProductDesc = _product.ProductDesc;
                    product.ProductFileId = _product.ProductFileId;
                    product.ProductId = _product.ProductId;
                    product.ProductImage = _productFile.FileName;
                    product.ProductName = _product.ProductName;
                }
                // product without image
                else
                {
                    product.CategoryId = _product.CategoryId;
                    product.Price = _product.Price;
                    product.ProductDesc = _product.ProductDesc;
                    product.ProductId = _product.ProductId;
                    product.ProductImage = null;
                    product.ProductName = _product.ProductName;
                }
            }
            return product;
        }

        public ProductDTO EditProduct(ProductDTO product)
        {
            var _product = _products_.Where(x => x.ProductId == product.ProductId).FirstOrDefault();
            if (_product != null)
            {
                _product.CategoryId = product.CategoryId;
                _product.ProductName = product.ProductName;
                _product.ProductDesc = product.ProductDesc;
                _product.Price = product.Price;

                return product;
            }
            else
            {
                return null;
            }
        }

        public ProductFileEditResponse ProductFileEdit(ProductFileEditResponse _productFile)
        {
            if (_productFile.ProductFileId > 0)
            {
                // edit
                var productFile = _productFiles_.Where(x => x.ProductFileId == _productFile.ProductFileId).FirstOrDefault();
                if (productFile != null)
                {
                    productFile.FileName = _productFile.ProductImage;
                    productFile.FilePath = _productFile.ProductImagePath;

                    _productFile.ResponseCode = 0;
                    _productFile.ResponseMessage = "Product Image Edited Successfully !";
                }
                else
                {
                    _productFile.ResponseCode = -1;
                    _productFile.ResponseMessage = "Server Error !";
                }
            }
            else
            {
                // add
            }
            return _productFile;
        }

        public IEnumerable<Category> GetCategories()
        {
            return _categories_.ToList();
        }

        public IEnumerable<ProductDTO> SearchProducts(string searchValue, string categoryId)
        {
            List<ProductDTO> products = new List<ProductDTO>();
            List<Product> _products = _products_ ;
            List<Product> _productsByNameDesc = new List<Product>();
            List<Product> _productsByCategory = new List<Product>();


            if (searchValue != null)
            {
                _productsByNameDesc = _products
                          .Where(x => x.ProductName.Contains(searchValue) || x.ProductDesc.Contains(searchValue)).ToList();
            }
            if (categoryId != null)
            {
                try
                {
                    int catId = Int32.Parse(categoryId);

                    _productsByCategory = _products
                             .Where(x => x.CategoryId == Convert.ToInt32(catId)).ToList();
                }
                catch (FormatException e)
                {
                    throw new Exception();
                }
            }

            // add
            _products = (_productsByNameDesc.Concat(_productsByCategory)).ToList();

            // removes duplicate
            _products = _products.Distinct(new DistinctProductComparer()).ToList();


            if (_products != null && _products.Count() > 0)
            {
                foreach (var _product in _products)
                {
                    var _productImage = _productFiles_
                                        .Where(x => x.ProductFileId == _product.ProductFileId).FirstOrDefault();
                    if (_productImage != null)
                    {
                        // products with image
                        products.Add(new ProductDTO()
                        {
                            CategoryId = _product.CategoryId,
                            Price = _product.Price,
                            ProductDesc = _product.ProductDesc,
                            ProductFileId = _product.ProductFileId,
                            ProductId = _product.ProductId,
                            ProductImage = _productImage.FileName,
                            ProductName = _product.ProductName,
                            CurrentPrice = _product.DiscountPrice > 0 ? _product.DiscountPrice : _product.Price
                        });
                    }
                    else
                    {
                        // products without image
                        products.Add(new ProductDTO()
                        {
                            CategoryId = _product.CategoryId,
                            Price = _product.Price,
                            ProductDesc = _product.ProductDesc,
                            ProductId = _product.ProductId,
                            ProductImage = null,
                            ProductName = _product.ProductName,
                            CurrentPrice = _product.DiscountPrice > 0 ? _product.DiscountPrice : _product.Price
                        });
                    }
                }
            }
            return products;
        }

        public ProductDiscountDTO SetProductDiscount(ProductDiscountDTO discount)
        {
            discount.APIResponse = new APIResponse();

            var _product = _products_
                                .Where(x => x.ProductId == discount.ProductId).FirstOrDefault();
            if (_product != null)
            {
                _product.DiscountPercentage = discount.DiscountPercentage;
                _product.DiscountPrice = _product.Price - ((_product.Price * discount.DiscountPercentage) / 100);
             
                discount.APIResponse.ResponseCode = 0;
                discount.APIResponse.ResponseMessage = "Discount Applied Successfully !";
                discount.DiscountPrice = _product.DiscountPrice;
                discount.Price = _product.Price;
            }
            else
            {
                discount.APIResponse.ResponseCode = -1;
                discount.APIResponse.ResponseMessage = "Product Not Found !";
            }
            return discount;
        }

    }
}
