using Microsoft.EntityFrameworkCore.Migrations;

namespace SS.Entity.Context.Migrations
{
    public partial class editpaymenttable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentType = table.Column<int>(nullable: false),
                    AmountPaid = table.Column<decimal>(nullable: false),
                    CardNumber = table.Column<int>(nullable: false),
                    CardCVV = table.Column<int>(nullable: false),
                    CardType = table.Column<string>(nullable: true),
                    ValidMonth = table.Column<int>(nullable: false),
                    ValidYear = table.Column<int>(nullable: false),
                    BillRefCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Payments");
        }
    }
}
