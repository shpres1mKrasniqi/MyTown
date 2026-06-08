using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.WorkSchedule
{
    public class WorkScheduleResponseDto
    {
        public int Id { get; set; }
        public string StaffName { get; set; }
        public DateTime Date { get; set; }
        public DaysOfWeek DayOfWeek { get; set; }
        public TimeSpan ShiftStart { get; set; }
        public TimeSpan ShiftEnd { get; set; }
        public ShiftType ShiftType { get; set; }
        public string Location { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
