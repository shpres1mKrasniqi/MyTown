namespace MyTown.Application.DTOs.Authentication
{
    public class AuthResponse
    {
        public int UserId { get; set; }
        public string AccessToken { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }

        public string Email { get; set; } = null!;

        public List<string> Roles { get; set; } = new();

        public string RefreshToken { get; set; } = null!;
    }
}
