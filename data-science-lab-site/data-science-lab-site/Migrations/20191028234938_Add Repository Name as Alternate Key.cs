using Microsoft.EntityFrameworkCore.Migrations;

namespace data_science_lab_site.Migrations
{
    public partial class AddRepositoryNameasAlternateKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddUniqueConstraint(
                name: "AK_Packages_RepositoryName",
                table: "Packages",
                column: "RepositoryName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_Packages_RepositoryName",
                table: "Packages");
        }
    }
}
