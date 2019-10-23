using Microsoft.EntityFrameworkCore.Migrations;

namespace data_science_lab_site.Migrations
{
    public partial class AddApplicationUsertoPluginPackage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Packages_AspNetUsers_ApplicationUserId",
                table: "Packages");

            migrationBuilder.RenameColumn(
                name: "ApplicationUserId",
                table: "Packages",
                newName: "UserId1");

            migrationBuilder.RenameIndex(
                name: "IX_Packages_ApplicationUserId",
                table: "Packages",
                newName: "IX_Packages_UserId1");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Packages",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Packages_AspNetUsers_UserId1",
                table: "Packages",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Packages_AspNetUsers_UserId1",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Packages");

            migrationBuilder.RenameColumn(
                name: "UserId1",
                table: "Packages",
                newName: "ApplicationUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Packages_UserId1",
                table: "Packages",
                newName: "IX_Packages_ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Packages_AspNetUsers_ApplicationUserId",
                table: "Packages",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
