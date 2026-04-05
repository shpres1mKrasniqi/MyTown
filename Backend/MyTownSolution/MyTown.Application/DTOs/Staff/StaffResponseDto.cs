namespace MyTown.Application.DTOs.StaffProfiles
{
    public class StaffResponseDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
        public string Email { get; set; } = null!;
        public string DepartmentName { get; set; }
        public string Position { get; set; } = null!;
        public DateTime DateHired { get; set; }


    }
}
