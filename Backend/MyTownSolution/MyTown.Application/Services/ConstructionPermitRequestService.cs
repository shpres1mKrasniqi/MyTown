using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain;
using MyTown.Domain.Common;
using System.Text.Json;

namespace MyTown.Application
{
    public class ConstructionPermitRequestService : IConstructionPermitRequestService
    {
        private readonly IConstructionPermitRequestRepository _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditRepository _auditRepository;
        private readonly IDocumentFileService _fileService;

        public ConstructionPermitRequestService(
            IConstructionPermitRequestRepository repo,
            IUnitOfWork unitOfWork,
            IAuditRepository auditRepository,
            IDocumentFileService fileService)
        {
            _repo = repo;
            _unitOfWork = unitOfWork;
            _auditRepository = auditRepository;
            _fileService = fileService;
        }

        public async Task AddConstructionPermitRequestAsync(
            CreateConstructionPermitRequestDto dto, int citizenId, string ipAddress)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            var permitRequest = new ConstructionPermitRequest(
                citizenId,
                dto.Title,
                dto.Description
            );

            foreach (var doc in dto.Documents)
            {

                var (filePath, fileName, fileSize) = await _fileService.SaveFileAsync(doc.File);
                permitRequest.AddDocument(filePath, fileName, fileSize, doc.Type);
            }

            await _repo.AddConstructionPermitRequestAsync(permitRequest);
            await _unitOfWork.SaveChangesAsync();

            var newValue = JsonSerializer.Serialize(new
            {
                permitRequest.Title,
                permitRequest.Description,
                Status = permitRequest.Status.ToString()
            });

            await _auditRepository.AddAsync(new AuditLog(
                citizenId,
                "CREATE",
                nameof(ConstructionPermitRequest),
                permitRequest.Id,
                null,
                newValue,
                ipAddress ?? "Unknown IP"
            ));

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<ConstructionPermitRequestResponseDto>> GetAllRequestsAsync()
        {
            var requests = await _repo.GetAllConstructionPermitRequests();
            return requests.Select(r => MapToDto(r));
        }

        public async Task<ConstructionPermitRequestResponseDto> GetPermitReqById(int id)
        {
            var r = await _repo.GetConstructionPermitRequestById(id);

            if (r == null)
                throw new KeyNotFoundException($"Request with id {id} was not found.");

            return MapToDto(r);
        }

        public async Task UpdatePermitRequestAsync(
            int id,
            UpdateConstructionPermitRequestDto dto,
            int staffId,
            string ipAddress)
        {
            var request = await _repo.GetConstructionPermitRequestById(id);

            if (request == null)
                throw new KeyNotFoundException($"Request with id {id} was not found.");

            var oldValue = JsonSerializer.Serialize(new
            {
                Status = request.Status.ToString()
            });

            request.UpdateRequestStatus(dto.Status, staffId);

            await _repo.UpdateAsync(request);
            await _unitOfWork.SaveChangesAsync();

            var newValue = JsonSerializer.Serialize(new
            {
                Status = request.Status.ToString()
            });

            await _auditRepository.AddAsync(new AuditLog(
                staffId,
                "UPDATE",
                nameof(ConstructionPermitRequest),
                request.Id,
                oldValue,
                newValue,
                ipAddress ?? "Unknown IP"
            ));

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateDocumentsAsync(int id, UpdateConstructionDocumentsDto dto, int staffId, string ipAddress)
        {
            var request = await _repo.GetConstructionPermitRequestById(dto.RequestId);

            if (request == null)
                throw new KeyNotFoundException($"Request with id {dto.RequestId} was not found.");

            foreach (var doc in dto.Documents)
            {
                var (filePath, fileName, fileSize) = await _fileService.SaveFileAsync(doc.File);

                request.AddDocument(filePath, fileName, fileSize, doc.Type);
            }

            await _repo.UpdateAsync(request);
            await _unitOfWork.SaveChangesAsync();

            await _auditRepository.AddAsync(new AuditLog(
                staffId,
                "UPDATE_DOCUMENTS",
                nameof(ConstructionPermitRequest),
                request.Id,
                null,
                $"Added {dto.Documents.Count} document(s)",
                ipAddress ?? "Unknown IP"
            ));

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task SoftDeleteRequest(int requestId, int citizenId, string ipAddress)
        {

            var request = await _repo.GetConstructionPermitRequestById(requestId);

            if (request == null)
                throw new KeyNotFoundException($"Request with id {requestId} was not found.");

            request.SoftDelete(citizenId);

            await _repo.SoftDeleteAsync(request);
            await _unitOfWork.SaveChangesAsync();

            await _auditRepository.AddAsync(new AuditLog(
                citizenId,
                "DELETE",
                nameof(ConstructionPermitRequest),
                request.Id,
                null,
                "Soft Deleted",
                ipAddress ?? "IP Adres e panjohur"
            ));

            await _unitOfWork.SaveChangesAsync();
        }

        private static ConstructionPermitRequestResponseDto MapToDto(ConstructionPermitRequest r)
        {
            return new ConstructionPermitRequestResponseDto
            {
                Id = r.Id,
                Title = r.Title,
                Description = r.Description,
                Status = r.Status,
                CitizenId = r.CitizenId,

                CitizenName = r.Citizen?.User?.FirstName,
                CreatedAt = r.CreatedAt,
                Documents = r.ConstructionDocuments.Select(d => new ConstructionDocumentResponseDto
                {
                    Id = d.Id,
                    FileName = d.FileName,
                    FileUrl = d.FilePath,
                    Type = d.Type
                }).ToList()
            };
        }
    }
}