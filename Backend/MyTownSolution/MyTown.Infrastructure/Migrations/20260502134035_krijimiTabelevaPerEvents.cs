using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTown.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class krijimiTabelevaPerEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CitizenProfiles_Users_UserId",
                table: "CitizenProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_StaffProfiles_Users_UserId",
                table: "StaffProfiles");

            migrationBuilder.AddColumn<int>(
                name: "EventId",
                table: "Files",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KomunaId = table.Column<int>(type: "int", nullable: false),
                    StaffId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Events_Komunas_KomunaId",
                        column: x => x.KomunaId,
                        principalTable: "Komunas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Events_StaffProfiles_StaffId",
                        column: x => x.StaffId,
                        principalTable: "StaffProfiles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EventVotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<int>(type: "int", nullable: false),
                    CitizenId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
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
                name: "IX_Files_EventId",
                table: "Files",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_KomunaId",
                table: "Events",
                column: "KomunaId");

            migrationBuilder.CreateIndex(
                name: "IX_Events_StaffId",
                table: "Events",
                column: "StaffId");

            migrationBuilder.CreateIndex(
                name: "IX_EventVotes_CitizenId",
                table: "EventVotes",
                column: "CitizenId");

            migrationBuilder.CreateIndex(
                name: "IX_EventVotes_EventId_CitizenId",
                table: "EventVotes",
                columns: new[] { "EventId", "CitizenId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CitizenProfiles_Users_UserId",
                table: "CitizenProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Events_EventId",
                table: "Files",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StaffProfiles_Users_UserId",
                table: "StaffProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CitizenProfiles_Users_UserId",
                table: "CitizenProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Files_Events_EventId",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_StaffProfiles_Users_UserId",
                table: "StaffProfiles");

            migrationBuilder.DropTable(
                name: "EventVotes");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Files_EventId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Files");

            migrationBuilder.AddForeignKey(
                name: "FK_CitizenProfiles_Users_UserId",
                table: "CitizenProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StaffProfiles_Users_UserId",
                table: "StaffProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
