namespace MyTown.Application.DTOs.Staff
{
    public class CreateStaffDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Position { get; set; } = null!;
        public DateTime DateHired { get; set; }

        public int DepartmentId { get; set; }


    }
} 