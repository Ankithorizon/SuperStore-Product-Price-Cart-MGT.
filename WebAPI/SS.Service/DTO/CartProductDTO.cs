﻿using System;
using System.Collections.Generic;
using System.Text;

namespace SS.Service.DTO
{
    public class CartProductDTO
    {
        public int ProductId { get; set; }
        public int QtyBuy { get; set; }
        public decimal CurrentPrice { get; set; }
        public string productImage { get; set; }
    }
}
