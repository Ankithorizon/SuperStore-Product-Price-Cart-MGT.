using SS.Entity.Context.Models;
using SS.Service.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace SS.Service.Interfaces
{
    public interface IProductRepository
    {
        Product AddProduct(Product product);
        ProductFileAddResponse ProductFileAdd(ProductFile productFile);
        IEnumerable<ProductDTO> GetAllProducts();
        ProductDTO GetProduct(int productId);
        ProductDTO EditProduct(ProductDTO product);
        ProductFileEditResponse ProductFileEdit(ProductFileEditResponse _productFile);
        IEnumerable<Category> GetCategories();
        IEnumerable<ProductDTO> SearchProducts(string searchValue, string categoryId);
        ProductDiscountDTO SetProductDiscount(ProductDiscountDTO discount);

    }
}
