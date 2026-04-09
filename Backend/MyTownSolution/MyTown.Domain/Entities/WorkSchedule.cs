using MyTown.Domain.Common;
using MyTown.Domain.Enums;

namespace MyTown.Domain.Entities
{
    public class WorkSchedule : BaseEntity
    {
        public int StaffId { get; private set; }
        public StaffProfile StaffProfile { get; private set; }
        public DateTime Date { get; private set; }
        public DaysOfWeek DayOfWeek { get; private set; }
        public TimeSpan ShiftStart { get; private set; }
        public TimeSpan ShiftEnd { get; private set; }
        public ShiftType ShiftType { get; private set; }
        public string Location { get; private set; }

        public string Notes { get; private set; }

        public bool IsDeleted { get; private set; }

        protected WorkSchedule() { }

        public WorkSchedule(int staffId, DateTime date, DaysOfWeek dayOfWeek, TimeSpan shiftStart, TimeSpan shiftEnd, ShiftType shiftType, string location, string notes)
        {
            StaffId = staffId;
            Date = date;
            DayOfWeek = dayOfWeek;
            ShiftStart = shiftStart;
            ShiftEnd = shiftEnd;
            ShiftType = shiftType;
            Location = location;
            Notes = notes;
            IsDeleted = false;
        }
        public void Update(DateTime date, DaysOfWeek dayOfWeek, TimeSpan shiftStart, TimeSpan shiftEnd, ShiftType shiftType, string location, string notes, int userId)
        {
            Date = date;
            DayOfWeek = dayOfWeek;
            ShiftStart = shiftStart;
            ShiftEnd = shiftEnd;
            ShiftType = shiftType;
            Location = location;
            Notes = notes;
            UpdatedAt = DateTime.UtcNow;
            SetUpdated(userId);
        }

        public void Delete(int userId)
        {
            IsDeleted = true;
            UpdatedAt = DateTime.UtcNow;
            SetUpdated(userId);
        }
    }
}
