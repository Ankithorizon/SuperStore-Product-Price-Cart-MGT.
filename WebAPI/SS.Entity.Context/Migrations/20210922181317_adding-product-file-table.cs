using Microsoft.EntityFrameworkCore.Migrations;

namespace SS.Entity.Context.Migrations
{
    public partial class addingproductfiletable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageName",
                table: "Tutorials");

            migrationBuilder.AddColumn<int>(
                name: "ProductFileId",
                table: "Tutorials",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductFileId",
                table: "Tutorials");

            migrationBuilder.AddColumn<string>(
                name: "ImageName",
                table: "Tutorials",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
