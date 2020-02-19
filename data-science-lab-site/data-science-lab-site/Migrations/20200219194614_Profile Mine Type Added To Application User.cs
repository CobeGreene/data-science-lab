using Microsoft.EntityFrameworkCore.Migrations;

namespace data_science_lab_site.Migrations
{
    public partial class ProfileMineTypeAddedToApplicationUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileMineType",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileMineType",
                table: "AspNetUsers");
        }
    }
}
