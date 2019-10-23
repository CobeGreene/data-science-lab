using Microsoft.EntityFrameworkCore.Migrations;

namespace data_science_lab_site.Migrations
{
    public partial class ChangePlugintohaveOwnerandRepositoryName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Url",
                table: "Plugins");

            migrationBuilder.AddColumn<string>(
                name: "Owner",
                table: "Plugins",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RepositoryName",
                table: "Plugins",
                maxLength: 256,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Owner",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "RepositoryName",
                table: "Plugins");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Plugins",
                nullable: false,
                defaultValue: "");
        }
    }
}
