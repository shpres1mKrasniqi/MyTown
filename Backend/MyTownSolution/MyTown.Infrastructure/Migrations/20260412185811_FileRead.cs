using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTown.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FileRead : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IssueId",
                table: "Files",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Files_IssueId",
                table: "Files",
                column: "IssueId");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Issues_IssueId",
                table: "Files",
                column: "IssueId",
                principalTable: "Issues",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Issues_IssueId",
                table: "Files");

            migrationBuilder.DropIndex(
                name: "IX_Files_IssueId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "IssueId",
                table: "Files");
        }
    }
}
