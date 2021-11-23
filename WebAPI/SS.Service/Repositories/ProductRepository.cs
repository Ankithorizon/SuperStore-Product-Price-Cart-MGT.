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
    public class ProductRepository : IProductRepository
    {
        private readonly SSContext appDbContext;       
        public ProductRepository(SSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public Product AddProduct(Product product)
        {
            var result = appDbContext.Products.Add(product);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        // product image info save to db
        public ProductFileAddResponse ProductFileAdd(ProductFile productFile)
        {
            ProductFileAddResponse response = new ProductFileAddResponse();
            try
            {
                // throw new Exception();

                var productFileSaved = appDbContext.ProductFiles.Add(productFile);
                appDbContext.SaveChanges();
                response.ResponseCode = 0;
                response.ResponseMessage = "Product File Saved Successfully !";
                response.ProductFileId = productFileSaved.Entity.ProductFileId;
                response.ProductImage = productFileSaved.Entity.FileName;
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
            List<ProductDTO> products = new List<ProductDTO>();

            var _products = appDbContext.Products;

            if (_products != null && _products.Count() > 0)
            {
                foreach (var _product in _products)
                {
                    var _productImage = appDbContext.ProductFiles
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
                            CurrentPrice = _product.DiscountPrice>0 ? _product.DiscountPrice : _product.Price,
                            CurrentDiscountPercentage= _product.DiscountPercentage
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
                            CurrentPrice = _product.DiscountPrice > 0 ? _product.DiscountPrice : _product.Price,
                            CurrentDiscountPercentage = _product.DiscountPercentage
                        });
                    }
                }
            }
            return products;
        }

        public IEnumerable<ProductDTO> SearchProducts(string searchValue, string categoryId)
        {
            List<ProductDTO> products = new List<ProductDTO>();
            IQueryable<Product> _products = appDbContext.Products;
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
                /*
                _productsByCategory = _products
                         .Where(x => x.CategoryId == Convert.ToInt32(categoryId)).ToList();
                */
            }

            // add
            _products = (_productsByNameDesc.Concat(_productsByCategory)).AsQueryable<Product>();

            // removes duplicate
            _products = _products.Distinct(new DistinctProductComparer()).AsQueryable<Product>();


            if (_products != null && _products.Count() > 0)
            {
                foreach (var _product in _products)
                {
                    var _productImage = appDbContext.ProductFiles
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

            var _product = appDbContext.Products
                                .Where(x => x.ProductId == productId).FirstOrDefault();
            if (_product != null)
            {
                var _productFile = appDbContext.ProductFiles
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
            var _product = appDbContext.Products.Where(x => x.ProductId == product.ProductId).FirstOrDefault();
            if (_product != null)
            {
                _product.CategoryId = product.CategoryId;
                _product.ProductName = product.ProductName;
                _product.ProductDesc = product.ProductDesc;
                _product.Price = product.Price;

                appDbContext.SaveChanges();
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
                // existing product image
                var productFile = appDbContext.ProductFiles.Where(x => x.ProductFileId == _productFile.ProductFileId).FirstOrDefault();
                if (productFile != null)
                {
                    productFile.FileName = _productFile.ProductImage;
                    productFile.FilePath = _productFile.ProductImagePath;
                    appDbContext.SaveChanges();

                    _productFile.ResponseCode = 0;                    
                    _productFile.ResponseMessage = "Image-EDIT : Success !";
                }                
                else
                {
                }
            }
            // existing product NO image
            else
            {
                // This product has Image before, but Now it has NO Image and
                // User is uploading new Image for this product
                using var transaction = appDbContext.Database.BeginTransaction();

                try
                {
                    // 1) add @ ProductFiles                          
                    var productFileSaved = appDbContext.ProductFiles.Add(new ProductFile()
                    {
                        FileName = _productFile.ProductImage,
                        FilePath = _productFile.ProductImagePath
                    });
                    appDbContext.SaveChanges();

                    // check for transaction rollback
                    // throw new Exception();

                    // 2) update @ Products
                    var product_ = appDbContext.Products
                                    .Where(x => x.ProductId == _productFile.ProductId).FirstOrDefault();
                    product_.ProductFileId = productFileSaved.Entity.ProductFileId;
                    appDbContext.SaveChanges();

                    _productFile.ResponseCode = 0;
                    _productFile.ResponseMessage = "Image-EDIT : Success !";

                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();

                    _productFile.ResponseCode = -1;
                    _productFile.ResponseMessage = "Image-EDIT : Fail !";
                }               
            }
            return _productFile;
        }

        public IEnumerable<Category> GetCategories()
        {
            return appDbContext.Categories.ToList();
        }

        public ProductDiscountDTO SetProductDiscount(ProductDiscountDTO discount)
        {
            discount.APIResponse = new APIResponse();

            var _product = appDbContext.Products
                                .Where(x => x.ProductId == discount.ProductId).FirstOrDefault();
            if (_product != null)
            {
                // update @ Products
                _product.DiscountPercentage = discount.DiscountPercentage;
                _product.DiscountPrice = _product.Price-((_product.Price * discount.DiscountPercentage) / 100);

                // insert @ DiscountHistories
                // check if never discount has been set for this product
                var discountSetFound = appDbContext.DiscountHistories
                                .Where(x => x.ProductId == discount.ProductId).FirstOrDefault();
                if (discountSetFound != null)
                {
                    // ever discount has been set for this product
                    // find the last record
                    var lastDiscountSet = appDbContext.DiscountHistories
                                            .Where(x => x.ProductId == discount.ProductId)
                                            .OrderBy(x => x.DiscountHistoryId);
                    if(lastDiscountSet!=null && lastDiscountSet.Count() > 0)
                    {
                        // update DiscountEffectiveEnd 
                        lastDiscountSet.LastOrDefault().DiscountEffectiveEnd = DateTime.Now.AddDays(-1);
                    }  
                    // insert @ DiscountHistories
                    appDbContext.DiscountHistories.Add(new DiscountHistory()
                    {
                        DiscountEffectiveBegin = DateTime.Now,
                        DiscountPercentage = discount.DiscountPercentage,
                        ProductId = discount.ProductId,
                        DiscountEffectiveEnd = null
                    });
                }
                else
                {
                    // never discount has been set for this product
                    // insert @ DiscountHistories
                    appDbContext.DiscountHistories.Add(new DiscountHistory()
                    {
                         DiscountEffectiveBegin = DateTime.Now,
                           DiscountPercentage = discount.DiscountPercentage,
                            ProductId = discount.ProductId
                    });
                }

                appDbContext.SaveChanges();

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
