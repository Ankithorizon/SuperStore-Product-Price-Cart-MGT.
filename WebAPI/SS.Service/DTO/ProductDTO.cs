using System;
using System.Collections.Generic;
using System.Text;

namespace SS.Service.DTO
{
    public class ProductDTO
    {
        public int CategoryId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductDesc { get; set; }
        public decimal Price { get; set; }
        public int ProductFileId { get; set; }
        public string ProductImage { get; set; }
        public decimal CurrentPrice { get; set; }
        public int CurrentDiscountPercentage { get; set; }
    }
}
