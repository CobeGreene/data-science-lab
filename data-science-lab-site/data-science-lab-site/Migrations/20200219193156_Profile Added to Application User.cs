using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace data_science_lab_site.Migrations
{
    public partial class ProfileAddedtoApplicationUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Profile",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Profile",
                table: "AspNetUsers");
        }
    }
}
