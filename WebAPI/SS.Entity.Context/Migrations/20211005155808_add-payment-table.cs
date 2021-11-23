using Microsoft.EntityFrameworkCore.Migrations;

namespace SS.Entity.Context.Migrations
{
    public partial class addpaymenttable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BillRefCode",
                table: "ProductSells",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillRefCode",
                table: "ProductSells");
        }
    }
}
