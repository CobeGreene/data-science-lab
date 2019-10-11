using Microsoft.EntityFrameworkCore.Migrations;

namespace data_science_lab_site.Migrations
{
    public partial class PluginNameandUrlAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Plugins",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Plugins",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Plugins");
        }
    }
}
