using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTown.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddKomunasTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Komunas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Komunas", x => x.Id);
                });

            // Siguron qe çdo KomunaId ekzistues ne Departments ka rresht ne Komunas para FK
            migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Departments')
BEGIN
  SET IDENTITY_INSERT Komunas ON;
  INSERT INTO Komunas (Id, Name, Description, IsDeleted, IsActive, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
  SELECT DISTINCT d.KomunaId, N'Komuna ' + CAST(d.KomunaId AS nvarchar(32)), NULL, CAST(0 AS bit), CAST(1 AS bit), GETUTCDATE(), NULL, NULL, NULL
  FROM Departments d
  WHERE NOT EXISTS (SELECT 1 FROM Komunas k WHERE k.Id = d.KomunaId);
  SET IDENTITY_INSERT Komunas OFF;
END
");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_KomunaId",
                table: "Departments",
                column: "KomunaId");

            migrationBuilder.CreateIndex(
                name: "IX_Komunas_Name",
                table: "Komunas",
                column: "Name",
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Komunas_KomunaId",
                table: "Departments",
                column: "KomunaId",
                principalTable: "Komunas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Komunas_KomunaId",
                table: "Departments");

            migrationBuilder.DropTable(
                name: "Komunas");

            migrationBuilder.DropIndex(
                name: "IX_Departments_KomunaId",
                table: "Departments");
        }
    }
}
