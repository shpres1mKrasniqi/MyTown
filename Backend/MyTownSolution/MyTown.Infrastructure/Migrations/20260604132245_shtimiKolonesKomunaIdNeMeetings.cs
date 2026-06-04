using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTown.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class shtimiKolonesKomunaIdNeMeetings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KomunaId",
                table: "MeetingRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KomunaId",
                table: "MeetingRequests");
        }
    }
}
