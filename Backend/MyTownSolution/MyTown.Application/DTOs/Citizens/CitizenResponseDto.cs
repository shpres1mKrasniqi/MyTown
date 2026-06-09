namespace MyTown.Application.DTOs.Citizens
{
    public class CitizenResponseDto
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Address { get; set; }

        public string PhoneNumber { get; set; }

        public int KomunaId { get; set; }

        public string KomunaName { get; set; }
    }
}