using System.ComponentModel.DataAnnotations;

namespace MyTown.Application.DTOs.Authentication
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
    }
}