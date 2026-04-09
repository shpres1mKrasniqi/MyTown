using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.WorkSchedule
{
    public class CreateWorkScheduleDto
    {
        public int StaffId { get; set; }
        public DateTime Date { get; set; }
        public DaysOfWeek DayOfWeek { get; set; }
        public TimeSpan ShiftStart { get; set; }
        public TimeSpan ShiftEnd { get; set; }
        public ShiftType ShiftType { get; set; }
        public string Location { get; set; }
        public string Notes { get; set; }
    }
}
