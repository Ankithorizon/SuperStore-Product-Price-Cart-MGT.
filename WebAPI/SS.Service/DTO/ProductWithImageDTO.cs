using System;
using System.Collections.Generic;
using System.Text;

namespace SS.Service.DTO
{
    public class ProductWithImageDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal CurrentPrice { get; set; }
        public string ProductImage { get; set; }        
    }
}
