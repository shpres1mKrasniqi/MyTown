using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyTown.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ProjektPropozimetFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectProposals_StaffProfiles_StaffProfileId",
                table: "ProjectProposals");

            migrationBuilder.DropIndex(
                name: "IX_ProjectProposals_StaffProfileId",
                table: "ProjectProposals");

            migrationBuilder.DropColumn(
                name: "StaffProfileId",
                table: "ProjectProposals");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StaffProfileId",
                table: "ProjectProposals",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectProposals_StaffProfileId",
                table: "ProjectProposals",
                column: "StaffProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectProposals_StaffProfiles_StaffProfileId",
                table: "ProjectProposals",
                column: "StaffProfileId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
