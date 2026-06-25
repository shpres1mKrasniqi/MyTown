using MyTown.Domain.Common;

namespace MyTown.Domain.Entities
{
    public class StaffProfile : BaseEntity
    {
       
        public int UserId { get; private set; }

        public User User { get; private set; } = null!;

        public int DepartmentId { get; private set; }

        public Department Department { get; private set; } = null!;
        public string Position { get; private set; }

        public DateTime DateHired { get; private set; }


        public bool IsDeleted { get; private set; }
        protected StaffProfile() { }

        public StaffProfile(User user, string position, DateTime dateHired, int departmentId)
        {
            User = user;
            Position = position;
            DateHired = dateHired;
            DepartmentId = departmentId;
            IsDeleted = false;
        }

        public void Update(string position, DateTime dateHired, int departmentId)
        {
            Position = position;
            DateHired = dateHired;
            DepartmentId = departmentId;
          
        }

        public void Delete()
        {
            IsDeleted = true;
            UpdatedAt = DateTime.UtcNow;
            User.IsActive = false;
        }
        public ICollection<WorkSchedule> WorkSchedules { get; set; } = new List<WorkSchedule>();
    }
}