using MyTown.Application.DTOs.WorkSchedule;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;
using System.Collections;

namespace MyTown.Application.Services
{
    public class WorkScheduleService : IWorkScheduleService
    {
        private readonly IWorkScheduleRepository _workScheduleRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditRepository _auditRepository;

        public WorkScheduleService(IWorkScheduleRepository workScheduleRepository, IUnitOfWork unitOfWork, IAuditRepository auditRepository)
        {
            _workScheduleRepository = workScheduleRepository;
            _unitOfWork = unitOfWork;
            _auditRepository = auditRepository;
        }

        public async Task<WorkScheduleResponseDto> CreateWorkScheduleAsync(CreateWorkScheduleDto dto, int userId, string ip)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            var workSchedule = new WorkSchedule(
                dto.StaffId,
                dto.Date,
                dto.DayOfWeek,
                dto.ShiftStart,
                dto.ShiftEnd,
                dto.ShiftType,
                dto.Location,
                dto.Notes
            );

            workSchedule.SetCreated(userId);

            await _workScheduleRepository.CreateWorkScheduleAsync(workSchedule);
            await _unitOfWork.SaveChangesAsync();

            // ✅ AUDIT (pa cycle)
            var audit = new AuditLog(
                userId,
                "CREATE",
                "WorkSchedule",
                workSchedule.Id,
                null,
                $"Created WorkSchedule for StaffId: {dto.StaffId}",
                ip
            );

            await _auditRepository.AddAsync(audit);
            await _unitOfWork.SaveChangesAsync();

            var created = await _workScheduleRepository.GetWorkScheduleByIdAsync(workSchedule.Id);

            return MapToDto(created);
        }

        public async Task DeleteWorkScheduleAsync(int id, int userId, string ip)
        {
            var workSchedule = await _workScheduleRepository.GetWorkScheduleByIdAsync(id);

            if (workSchedule == null)
                throw new Exception($"WorkSchedule me id '{id}' nuk u gjet.");

            var oldValue = System.Text.Json.JsonSerializer.Serialize(MapToDto(workSchedule));

            workSchedule.Delete(userId); // soft delete

            var audit = new AuditLog(
                userId,
                "DELETE",
                "WorkSchedule",
                workSchedule.Id,
                oldValue,
                "Soft Deleted",
                ip
            );

            await _auditRepository.AddAsync(audit);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task UpdateWorkScheduleAsync(int id, UpdateWorkScheduleDto dto, int userId, string ip)
        {
            var workSchedule = await _workScheduleRepository.GetWorkScheduleByIdAsync(id);

            if (workSchedule == null)
                throw new Exception($"WorkSchedule me id '{id}' nuk u gjet.");

            // ✅ OLD VALUE (DTO, jo entity!)
            var oldValue = System.Text.Json.JsonSerializer.Serialize(MapToDto(workSchedule));

            workSchedule.Update(
                dto.Date,
                dto.DayOfWeek,
                dto.ShiftStart,
                dto.ShiftEnd,
                dto.ShiftType,
                dto.Location,
                dto.Notes,
                userId
            );

            // ✅ NEW VALUE
            var newValue = System.Text.Json.JsonSerializer.Serialize(MapToDto(workSchedule));

            var audit = new AuditLog(
                userId,
                "UPDATE",
                "WorkSchedule",
                workSchedule.Id,
                oldValue,
                newValue,
                ip
            );

            await _auditRepository.AddAsync(audit);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task<IEnumerable<WorkScheduleResponseDto>> GetAllAsync()
        {
            var list = await _workScheduleRepository.GetAllWorkSchedulesAsync();

            return list.Select(MapToDto).ToList();
        }
        public async Task<WorkScheduleResponseDto> GetByIdAsync(int id)
        {
            var ws = await _workScheduleRepository.GetWorkScheduleByIdAsync(id);

            if (ws == null)
                throw new Exception($"WorkSchedule me id '{id}' nuk u gjet.");

            return MapToDto(ws);
        }

        private WorkScheduleResponseDto MapToDto(WorkSchedule ws)
        {
            return new WorkScheduleResponseDto
            {
                StaffName = ws.StaffProfile.User.FirstName + " " + ws.StaffProfile.User.LastName,
                Date = ws.Date,
                DayOfWeek = ws.DayOfWeek,
                ShiftStart = ws.ShiftStart,
                ShiftEnd = ws.ShiftEnd,
                ShiftType = ws.ShiftType,
                Location = ws.Location,
                CreatedAt = ws.CreatedAt,
                UpdatedAt = ws.UpdatedAt
            };
        }
    }
}
