using MyTown.Domain.Common;

namespace MyTown.Domain.Entities
{
    public class CitizenProfile
    {
        
        public int Id { get; private set; }
        public int UserId { get; private set; }

        public User User { get; private set; }

        public int KomunaId { get; private set; }

        public Komuna Komuna { get; private set; }

        public string PhoneNumber { get; private set; }

        public string Address { get; private set; }

        public string PersonalNumber { get; private set; } = null!;
        public DateTime DateOfBirth { get; private set; }
        public string? Nationality { get; private set; }
        public string? PlaceOfBirth { get; private set; } = null!;
        public bool IsDeleted { get; private set; }

        public DateTime CreatedAt { get; private set; } 

        public DateTime? UpdatedAt { get; private set; } 

        public ICollection<Issue> Issues { get; private set; } = new List<Issue>();
        public ICollection<MeetingRequest> MeetingRequests { get; private set; } = new List<MeetingRequest>();
        protected CitizenProfile() { }

        public CitizenProfile(
            User user,
            int komunaId,
            string phoneNumber,
            string address,
            string personalNumber,
            DateTime dateOfBirth,
            string? nationality,
        string? placeOfBirth
        )
        {
            Guard.AgainstNullOrEmpty(personalNumber, nameof(personalNumber));
            Guard.AgainstNullOrEmpty(phoneNumber, nameof(phoneNumber));

            User = user;
            KomunaId = komunaId;
            PhoneNumber = phoneNumber;
            Address = address;

            PersonalNumber = personalNumber;
            DateOfBirth = dateOfBirth;
            Nationality = nationality;
            PlaceOfBirth = placeOfBirth;

            IsDeleted = false;
            CreatedAt = DateTime.UtcNow;
        }

        public void Update(int komunaId, string phoneNumber, string address)
        {
            KomunaId = komunaId;
            PhoneNumber = phoneNumber;
            Address = address;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Delete()
        {
            IsDeleted = true;
            UpdatedAt = DateTime.UtcNow;
        }

        public void CompleteOptionalFields(string? nationality, string? placeOfBirth)
        {
            if (!string.IsNullOrWhiteSpace(nationality))
                Nationality = nationality;

            if (!string.IsNullOrWhiteSpace(placeOfBirth))
                PlaceOfBirth = placeOfBirth;

            UpdatedAt = DateTime.UtcNow;
        }
    }
}
