using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTown.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RregullimeStaff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "StaffProfiles",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "StaffProfiles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "StaffProfiles",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "StaffProfiles");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "StaffProfiles");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "StaffProfiles",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
