

using MyTown.Application.DTOs.MeetingRequests;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;
using MyTown.Domain.Enums;

namespace MyTown.Application.Services
{
    public class MeetingRequestService : IMeetingRequestService
    {
        private readonly IMeetingRequestRepository _meetingRequestRepository;
        private readonly IAuditRepository _auditRepository;
        private readonly IUnitOfWork _unitOfWork;
        public MeetingRequestService(IMeetingRequestRepository meetingRequestRepository, IAuditRepository auditRepository, IUnitOfWork unitOfWork)
        {
            _meetingRequestRepository = meetingRequestRepository;
            _auditRepository = auditRepository;
            _unitOfWork = unitOfWork;
        }


       public async Task  AddMeetingRequestAsync(AddMeetingRequestDto dto, int citizenId, string ipAddress)
        {
            if(dto == null)
            {
                throw new Exception("Format jo valid i kerkeses");
            }

            var meetingRequest = new MeetingRequest(
                citizenId,
                dto.Title,
                dto.Reason,
                dto.DateOfMeeting);

                await _meetingRequestRepository.AddMeetingRequestAsync(meetingRequest);
            await _unitOfWork.SaveChangesAsync();

            var newValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                meetingRequest.Title,
                meetingRequest.Reason,
                meetingRequest.DateOfMeeting,
                meetingRequest.CitizenId
            });

            var auditLog = new AuditLog
                (
                   citizenId,
                   "CREATE",
                   nameof(MeetingRequest),
                   meetingRequest.Id,
                   null,
                   newValue,
                   ipAddress ?? "IP Adresa e Panjohur"
                );

            await _auditRepository.AddAsync(auditLog);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<MeetingRequestResponseDto>> GetAllMeetingRequestsAsync()
        {
            var meetingRequests = await _meetingRequestRepository.GetMeetingRequestsAsync();

            if (meetingRequests == null || !meetingRequests.Any() )
            {
                return new List<MeetingRequestResponseDto>();
            }

                var meetingRequestDtos = meetingRequests.Select(mr => new MeetingRequestResponseDto
                {
                    Id = mr.Id,
                    Title = mr.Title,
                    Reason = mr.Reason,
                    Status = mr.Status,
                    DateOfMeeting = mr.DateOfMeeting
                }).ToList();

            return meetingRequestDtos;
        }

        public async Task<MeetingRequestResponseDto> GetMeetingRequestsByIdAsync(int requestId)
        {
            var meetingRequest = await _meetingRequestRepository.GetMeetingRequestById(requestId);

            if (meetingRequest == null || meetingRequest.IsDeleted)
            {
                 throw new Exception("Kërkesa për takim nuk u gjet.");
            }

            return new MeetingRequestResponseDto
            {
                Id = meetingRequest.Id,
                Title = meetingRequest.Title,
                Reason = meetingRequest.Reason,
                Status = meetingRequest.Status,
                DateOfMeeting = meetingRequest.DateOfMeeting
            };

        }

        public async Task SoftDeleteProposalAsync(int id, int citizenId, string ipAddress)
        {
            var meetingRequest = await _meetingRequestRepository.GetMeetingRequestById(id);

            if (meetingRequest == null || meetingRequest.IsDeleted)
            {
                throw new Exception("Kërkesa për takim nuk u gjet.");
            }

            if (meetingRequest.CitizenId != citizenId)
            {
                throw new Exception("Nuk keni leje për të fshirë këtë kërkesë për takim.");
            }

            meetingRequest.DeleteRequest(citizenId);

             _meetingRequestRepository.DeleteMeetingRequest(meetingRequest);
            await _unitOfWork.SaveChangesAsync();
            var auditLog = new AuditLog
                (
                   citizenId,
                   "DELETE",
                   nameof(MeetingRequest),
                   meetingRequest.Id,
                   null,
                   null,
                   ipAddress ?? "IP Adresa e Panjohur"
                );

            await _auditRepository.AddAsync(auditLog);

            await _unitOfWork.SaveChangesAsync();

        }

        public async Task UpdateAsync(int id, UpdateMeetingRequestStatusDto dto, int staffId, string ipAddress)
        {
            var meetingRequest = await _meetingRequestRepository.GetMeetingRequestById(id);

            if (meetingRequest == null || meetingRequest.IsDeleted)
            {
                throw new Exception("Kërkesa për takim nuk u gjet.");
            }


            meetingRequest.UpdateStatus(dto.Status, staffId);

            _meetingRequestRepository.Update(meetingRequest);
            await _unitOfWork.SaveChangesAsync();

            var newValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                meetingRequest.Status
            });

            var auditLog = new AuditLog
                (
                   staffId,
                   "UPDATE",
                   nameof(MeetingRequest),
                   meetingRequest.Id,
                   null,
                   System.Text.Json.JsonSerializer.Serialize(new { meetingRequest.Status }),
                   ipAddress ?? "IP Adresa e Panjohur"
                );

            await _auditRepository.AddAsync(auditLog);

            await _unitOfWork.SaveChangesAsync();
        }

    }
}
