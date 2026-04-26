namespace MyTown.Application.DTOs.Citizens
{
    public class CreateCitizenDto
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PersonalNumber { get; set; }
        public string? DateOfBirth { get; init; }
        public string Nationality { get; set; }
        public string PlaceOfBirth { get; set; }


        public string Email { get; set; }
        public string Password { get; set; }
        public int KomunaId { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
    }
}