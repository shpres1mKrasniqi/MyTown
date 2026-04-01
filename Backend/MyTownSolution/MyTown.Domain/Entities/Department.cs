using MyTown.Domain.Common;


namespace MyTown.Domain.Entities
{
    public class Department : BaseEntity
    {
       
        public string Name { get; private set; }
        public string Description { get; private set; }
        public bool IsActive { get; private set; }

        public ICollection<StaffProfile> StaffProfiles { get; private set; } = new List<StaffProfile>();
        public int KomunaId { get; private set; }
        public Komuna Komuna { get; private set; } = null!;


        protected Department() { }

        public Department(string name, string description, int komunaId)
        {
            Name = name;
            Description = description;
            IsActive = true;
            KomunaId = komunaId;
        }
        public void Update(string name , string description)
        {
            Name = name;
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }
        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
