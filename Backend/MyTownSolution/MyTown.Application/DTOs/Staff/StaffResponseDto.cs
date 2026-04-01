namespace MyTown.Application.DTOs.StaffProfiles
{
    public class StaffResponseDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }
        public string Position { get; set; } = null!;
        public DateTime DateHired { get; set; }


    }
}
