namespace MyTown.Application.DTOs.Authentication
{
    public class TokenUserDto
    {
        public int Id { get; set; }

        public int? CitizenId { get; set; }
        public int? StaffId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; } = new();
        public List<string> Permissions { get; set; } = new();
    }
}