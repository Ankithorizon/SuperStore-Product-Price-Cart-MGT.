using SS.Entity.Context.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
namespace SS.Entity.Context
{
    public class SSContext : DbContext
    {
        public SSContext(DbContextOptions<SSContext> options) : base(options)
        {
        }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductFile> ProductFiles { get; set; }
        public DbSet<ProductSell> ProductSells { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<DiscountHistory> DiscountHistories { get; set; }
    }
}
