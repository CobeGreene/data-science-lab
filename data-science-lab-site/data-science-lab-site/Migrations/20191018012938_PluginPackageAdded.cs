using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace data_science_lab_site.Migrations
{
    public partial class PluginPackageAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plugins_AspNetUsers_ApplicationUserId",
                table: "Plugins");

            migrationBuilder.DropIndex(
                name: "IX_Plugins_ApplicationUserId",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "RepositoryName",
                table: "Plugins");

            migrationBuilder.AddColumn<string>(
                name: "ClassName",
                table: "Plugins",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Plugins",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PluginPackageId",
                table: "Plugins",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Plugins",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Packages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: false),
                    Owner = table.Column<string>(maxLength: 256, nullable: false),
                    RepositoryName = table.Column<string>(maxLength: 256, nullable: false),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Packages", x => x.Id);
                    table.UniqueConstraint("AK_Packages_Name", x => x.Name);
                    table.ForeignKey(
                        name: "FK_Packages_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Plugins_PluginPackageId",
                table: "Plugins",
                column: "PluginPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_UserId",
                table: "Packages",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Plugins_Packages_PluginPackageId",
                table: "Plugins",
                column: "PluginPackageId",
                principalTable: "Packages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plugins_Packages_PluginPackageId",
                table: "Plugins");

            migrationBuilder.DropTable(
                name: "Packages");

            migrationBuilder.DropIndex(
                name: "IX_Plugins_PluginPackageId",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "ClassName",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "PluginPackageId",
                table: "Plugins");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Plugins");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Plugins",
                nullable: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_Plugins_ApplicationUserId",
                table: "Plugins",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Plugins_AspNetUsers_ApplicationUserId",
                table: "Plugins",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
