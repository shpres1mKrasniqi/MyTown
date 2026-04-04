using MyTown.Domain.Common;

namespace MyTown.Domain.Entities
{
    public class CitizenProfile : BaseEntity
    {

        public int UserId { get; private set; }

        public User User { get; private set; }

        public int KomunaId { get; private set; }

        public Komuna Komuna { get; private set; }

        public string PhoneNumber { get; private set; }

        public string Address { get; private set; }

        public bool IsDeleted { get; private set; }
        protected CitizenProfile() { }

        public CitizenProfile(User user, int komunaId, string phoneNumber, string address)
        {
            User = user;
            KomunaId = komunaId;
            PhoneNumber = phoneNumber;
            Address = address;
            IsDeleted = false;
        }

        public void Update(int komunaId, string phoneNumber, string address)
        {
            KomunaId = komunaId;
            PhoneNumber = phoneNumber;
            Address = address;
        }

        public void Delete(int adminId)
        {
            IsDeleted = true;
            UpdatedAt = DateTime.UtcNow;
            SetUpdated(adminId);
        }
    }
}
