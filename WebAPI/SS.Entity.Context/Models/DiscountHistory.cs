using System;
using System.Collections.Generic;
using System.Text;

namespace SS.Entity.Context.Models
{
    public class DiscountHistory
    {
        public int DiscountHistoryId { get; set; }
        public int ProductId { get; set; }
        public int DiscountPercentage { get; set; }

        // when user sets discount
        public DateTime DiscountEffectiveBegin { get; set; }

        // when user sets new discount
        public DateTime? DiscountEffectiveEnd { get; set; }
    }
}
