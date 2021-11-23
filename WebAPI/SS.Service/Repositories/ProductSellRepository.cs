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
    public class ProductSellRepository : IProductSellRepository
    {
        private readonly SSContext appDbContext;

        public ProductSellRepository(SSContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        // checked for in-built transaction & exception@last moment
        public BillDTO ProductBillCreate(BillDTO bill)
        {
            bill.BillRefCode = null;

            // generate refcode
            var refCode = RefCodeGenerator.RandomString(6);

            // 1)
            // insert @ ProductSell / Cart
            foreach (var product in bill.Cart.Products)
            {
                var _product = appDbContext.Products
                                    .Where(x => x.ProductId == product.ProductId).FirstOrDefault();
                ProductSell productDb = new ProductSell()
                {
                    ProductId = _product.ProductId,
                    BasePrice = _product.Price,
                    CurrentPrice = product.CurrentPrice,
                    BillQty = product.QtyBuy,
                    DiscountPercentage = _product.DiscountPercentage,
                    BillRefCode = refCode
                };
                appDbContext.ProductSells.Add(productDb);
            }

            // check for exception
            // throw new Exception();

            // 2)
            // insert @ Payment
            appDbContext.Payments.Add(new Payment()
            {
                AmountPaid = bill.Payment.AmountPaid,
                BillRefCode = refCode,
                CardCVV = bill.Payment.CardCVV,
                CardNumber = bill.Payment.CardNumber,
                CardType = bill.Payment.CardType,
                PaymentType = bill.Payment.PaymentType,
                ValidMonth = bill.Payment.ValidMonth,
                ValidYear = bill.Payment.ValidYear,
                TransactionDate = DateTime.Now
            });

            // check for exception
            // throw new Exception();

            // 3)
            // save 1 and 2
            appDbContext.SaveChanges();

            // 4)
            bill.BillRefCode = refCode;
            // bill.BillRefCode = null;
            return bill;
        }
    }
}
