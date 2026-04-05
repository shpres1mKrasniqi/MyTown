namespace MyTown.Application.DTOs.Authentication
{
    public class TokenUserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; } = null!;

        public List<string> Permissions { get; set; } = new List<string>();
    }
}