using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SS.Entity.Context.Models
{
    public class ProductSell
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SellId { get; set; }


        [Required]
        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public decimal BasePrice { get; set; }
        public int DiscountPercentage { get; set; }
        public decimal CurrentPrice { get; set; }

        public int BillQty { get; set; }


        [JsonIgnore]
        public Product Product { get; set; }

        public string BillRefCode { get; set; }
    }
}
