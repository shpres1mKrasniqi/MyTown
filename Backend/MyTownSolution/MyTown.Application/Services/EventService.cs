using MyTown.Application.DTOs.Event;
using MyTown.Application.DTOs.Files;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;
using MyTown.Domain.Enums;

namespace MyTown.Application.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditRepository _auditRepository;
        private readonly INotificationService _notificationService;
        private readonly IStaffRepository _staffRepository;
        private readonly IFileService _fileService;
        private readonly IFileRepository _fileRepository;
        private readonly ICitizenRepository _citizenRepository;

        public EventService(
            IEventRepository eventRepository,  IUnitOfWork unitOfWork, IAuditRepository auditRepository, INotificationService notificationService, IStaffRepository staffRepository,
            IFileService fileService, IFileRepository fileRepository, ICitizenRepository citizenRepository
            )
        {
            _eventRepository = eventRepository;
            _unitOfWork = unitOfWork;
            _auditRepository = auditRepository;
            _notificationService = notificationService;
            _staffRepository = staffRepository;
            _fileService = fileService;
            _fileRepository = fileRepository;
            _citizenRepository = citizenRepository;
        }
        public async Task<EventResponseDto> CreateEventAsync(CreateEventDto dto, int staffId, int userId, string ipAddress)
        {
           
            var staff = await _staffRepository.GetByIdAsync(staffId)
                ?? throw new Exception("Stafi nuk u gjet.");

            var ev = new Event(
                dto.Title,
                dto.Description,
                dto.EventDate,
                dto.Location,
                staff.DepartmentId,  
                staffId,
                userId
            );

            await _eventRepository.AddAsync(ev);
            await _unitOfWork.SaveChangesAsync();

            var citizens = await _citizenRepository.GetByKomunaIdAsync(ev.KomunaId);
            foreach (var citizen in citizens)
            {
                await _notificationService.CreateNotificationAsync(
                    citizen.UserId,
                    "New Event just Published",
                    $"A new event '{ev.Title}' has been published in your area. Check it out!",
                    NotificationType.Event
                    );
            }


            if (dto.Files != null && dto.Files.Count > 0)
            {
                foreach (var file in dto.Files)
                {
                    var result = await _fileService.SaveFileAsync(file, "events");
                    var fileEntity = new MyTownFile(
                        ((int)FileEntityType.Event).ToString(),
                        ev.Id,
                        result.fileName,
                        result.path,
                        result.size,
                        userId
                    );
                    fileEntity.EventId = ev.Id;
                    await _fileRepository.AddFileAsync(fileEntity);
                }
                await _unitOfWork.SaveChangesAsync();
            }

            await AddAuditLog(userId, "CREATE", ev.Id, null, ev, ipAddress);
            await _unitOfWork.SaveChangesAsync();
            var created = await _eventRepository.GetByIdAsync(ev.Id);
            return MapToDto(created!);
        }

      
        public async Task<IEnumerable<EventResponseDto>> GetAllEventsAsync(int? citizenId = null)
        {
            var events = await _eventRepository.GetAllAsync();
            return events.Select(ev => MapToDto(ev, citizenId));
        }
        public async Task<EventResponseDto?> GetEventByIdAsync(int id, int? citizenId = null)
        {
            var ev = await _eventRepository.GetByIdAsync(id);
            return ev == null ? null : MapToDto(ev, citizenId);
        }
        public async Task UpdateAsync(int id, UpdateEventDto dto, int userId, string ipAddress)
        {
            var ev = await _eventRepository.GetByIdAsync(id)
                ?? throw new Exception("Eventi nuk u gjet.");

            var oldValue = Serialize(ev);

            ev.Update(dto.Title, dto.Description, dto.EventDate, dto.Location, dto.Status, userId);
            await _eventRepository.UpdateAsync(ev);

            var newValue = $"Title: {ev.Title}, Description: {ev.Description}, EventDate:{ ev.EventDate}, Location: {ev.Location}, Status: {ev.Status}"
            ;

            var log = new AuditLog(
               userId,
               "UPDATE",
               "Event",
               ev.Id,
               oldValue,
               newValue,
               ipAddress
           );

            await _auditRepository.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id, int userId, string ipAddress)
        {
            var ev = await _eventRepository.GetByIdAsync(id)
                ?? throw new Exception("Eventi nuk u gjet.");

            var oldValue = Serialize(ev);
            ev.Delete(userId);

            await _eventRepository.UpdateAsync(ev);

            var newValue = $"Title: {ev.Title}, IsActive: {ev.IsDeleted}";

            var log = new AuditLog(
               userId,
                "SOFT_DELETE",
                "Event",
                ev.Id,
                oldValue,
                newValue,
                ipAddress
            );

            await _auditRepository.AddAsync(log);
            await _unitOfWork.SaveChangesAsync();
        }
        
        private static EventResponseDto MapToDto(Event ev, int? citizenId = null)
        {
            return new EventResponseDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                EventDate = ev.EventDate,
                Location = ev.Location,
                KomunaId = ev.KomunaId,
                KomunaName = ev.Komuna?.Name,
                StaffId = ev.StaffId,
                StaffName = ev.StaffProfile?.User?.FirstName,  // ✅
                Status = ev.Status,
                Files = ev.Files?.Select(f => new MyTownFileResponseDto  // ✅
                {
                    Id = f.Id,
                    FileName = f.FileName,
                    FileUrl = $"https://localhost:7214{f.FilePath}",
                    FileSize = f.FileSize,
                }).ToList() ?? new(),
                CreatedAt = ev.CreatedAt
            };
        }

        private static string Serialize(Event ev) =>
            System.Text.Json.JsonSerializer.Serialize(new
            {
                ev.Title,
                ev.Description,
                ev.EventDate,
                ev.Location,
                ev.KomunaId,
                ev.Status
            });
        private async Task AddAuditLog(int userId, string action, int entityId,
            string? oldValue, Event ev, string ipAddress)
        {
            var newValue = Serialize(ev);
            var audit = new AuditLog(userId, action, nameof(Event), entityId, oldValue, newValue, ipAddress ?? "Unknown");
            await _auditRepository.AddAsync(audit);
        }

    }
}

