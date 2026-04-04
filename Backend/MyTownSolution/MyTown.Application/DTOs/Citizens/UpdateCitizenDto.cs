
namespace MyTown.Application.DTOs.Citizens
{
    public class UpdateCitizenDto
    {
        public int KomunaId { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string Address { get; set; } = null!;
    }
}
