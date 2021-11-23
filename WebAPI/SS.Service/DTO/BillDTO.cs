using System;
using System.Collections.Generic;
using System.Text;

namespace SS.Service.DTO
{
    public class BillDTO
    {
        public string BillRefCode { get; set; }
        public PaymentDTO Payment { get; set; }
        public CartDTO Cart { get; set; }
    }
}
