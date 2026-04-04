
namespace MyTown.Application.DTOs.Staff
{
    public class UpdateStaffDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Position { get; set; } = null!;
        public DateTime DateHired { get; set; }

        public int DepartmentId { get; set; }
    }
}
