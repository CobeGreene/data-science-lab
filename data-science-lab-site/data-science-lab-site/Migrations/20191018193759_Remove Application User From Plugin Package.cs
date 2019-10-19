using Microsoft.EntityFrameworkCore.Migrations;

namespace data_science_lab_site.Migrations
{
    public partial class RemoveApplicationUserFromPluginPackage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Packages_AspNetUsers_UserId",
                table: "Packages");

            migrationBuilder.DropIndex(
                name: "IX_Packages_UserId",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Packages");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Plugins",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Packages",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Packages_ApplicationUserId",
                table: "Packages",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Packages_AspNetUsers_ApplicationUserId",
                table: "Packages",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Packages_AspNetUsers_ApplicationUserId",
                table: "Packages");

            migrationBuilder.DropIndex(
                name: "IX_Packages_ApplicationUserId",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Packages");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Plugins",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Packages",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_UserId",
                table: "Packages",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Packages_AspNetUsers_UserId",
                table: "Packages",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
