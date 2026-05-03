using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTown.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class largimiITabelesEventVote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventVotes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventVotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CitizenId = table.Column<int>(type: "int", nullable: false),
                    EventId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventVotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventVotes_CitizenProfiles_CitizenId",
                        column: x => x.CitizenId,
                        principalTable: "CitizenProfiles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EventVotes_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventVotes_CitizenId",
                table: "EventVotes",
                column: "CitizenId");

            migrationBuilder.CreateIndex(
                name: "IX_EventVotes_EventId_CitizenId",
                table: "EventVotes",
                columns: new[] { "EventId", "CitizenId" },
                unique: true);
        }
    }
}
