using MyTown.Domain.Common;

namespace MyTown.Domain.Entities
{
    public class Komuna : BaseEntity
    {
        public string Name { get; private set; } = null!;
        public string? Description { get; private set; }
        public bool IsDeleted { get; private set; }
        public bool IsActive { get; private set; }

        public ICollection<Department> Departments { get; private set; } = new List<Department>();

        protected Komuna() { }

        public Komuna(string name, string? description)
        {
            Name = name;
            Description = description;
            IsActive = true;
            IsDeleted = false;
        }

        public void Update(string name, string? description)
        {
            Name = name;
            Description = description;
        }

        public void MarkDeleted(int userId)
        {
            IsDeleted = true;
            IsActive = false;
            SetUpdated(userId);
        }
    }
}
