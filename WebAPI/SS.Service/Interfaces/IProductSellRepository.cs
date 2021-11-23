using SS.Entity.Context.Models;
using SS.Service.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace SS.Service.Interfaces
{
    public interface IProductSellRepository
    {
        BillDTO ProductBillCreate(BillDTO bill);
    }
}
