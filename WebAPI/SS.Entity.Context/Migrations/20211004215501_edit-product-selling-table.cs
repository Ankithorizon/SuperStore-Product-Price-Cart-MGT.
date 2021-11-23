using Microsoft.EntityFrameworkCore.Migrations;

namespace SS.Entity.Context.Migrations
{
    public partial class editproductsellingtable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillAmount",
                table: "ProductSells");

            migrationBuilder.AddColumn<decimal>(
                name: "CurrentPrice",
                table: "ProductSells",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentPrice",
                table: "ProductSells");

            migrationBuilder.AddColumn<decimal>(
                name: "BillAmount",
                table: "ProductSells",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
