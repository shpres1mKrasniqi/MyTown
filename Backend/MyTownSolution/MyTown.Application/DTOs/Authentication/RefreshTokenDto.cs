namespace MyTown.Application.DTOs.Authentication
{
    public class RefreshTokenDto
    {
        public string Token { get; set; } = null!;

        public DateTime ExpiresAt { get; set; }
    }
}
