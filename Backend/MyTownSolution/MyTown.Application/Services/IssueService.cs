

using MyTown.Application.DTOs.Files;
using MyTown.Application.DTOs.Issues;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;
using MyTown.Domain.Enums;

namespace MyTown.Application.Services
{
    public class IssueService : IIssueService
    {
        private readonly IIssueRepository _issueRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        private readonly IFileRepository _fileRepository;
        private readonly IAuditRepository _auditRepository;
        private readonly INotificationService _notificationService;
        private readonly IStaffRepository _staffRepository;

        public IssueService(IIssueRepository issueRepository, IUnitOfWork unitOfWork, IFileService fileService, IFileRepository fileRepository, IAuditRepository auditRepository, INotificationService notificationService, IStaffRepository staffRepository)
        {
            _issueRepository = issueRepository;
            _unitOfWork = unitOfWork;
            _fileService = fileService;
            _fileRepository = fileRepository;
            _auditRepository = auditRepository;
            _notificationService = notificationService;
            _staffRepository = staffRepository;
        }

        public async Task<IssueResponseDto> CreateIssueAsync(CreateIssueDto createIssueDto, int citizenId, int userId, string ipAddress)
        {
            var issue = new Issue
            (
                createIssueDto.Title,
                createIssueDto.Description,
                createIssueDto.IssueCategoryId,
                citizenId,
                createIssueDto.KomunaId,
                IssueStatus.Pending,
                userId
             );

            await _issueRepository.AddIssueAsync(issue);
            await _unitOfWork.SaveChangesAsync();

            var staffMembers = await _staffRepository.GetByKomunaIdAsync(issue.KomunaId);
            foreach(var staff in staffMembers)
            {
                await _notificationService.CreateNotificationAsync(
                    staff.UserId,
                    $"Nje qytetar ka raportuar nje problem te ri: {issue.Title}"
                    );
            }

            if (createIssueDto.Files != null && createIssueDto.Files.Count > 0)
            {
                foreach (var file in createIssueDto.Files)
                {
                    var result = await _fileService.SaveFileAsync(file);

                    var fileim = new MyTownFile(
                     ((int)FileEntityType.Issue).ToString(),
                     issue.Id,
                     result.fileName,
                     result.path,
                     result.size,
                     userId
                     );
                    await _fileRepository.AddFileAsync(fileim);

                }

                await _unitOfWork.SaveChangesAsync();
            }

            var newValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                issue.Title,
                issue.Description,
                issue.KomunaId,
                issue.IssueCategoryId
            });

            var audit = new AuditLog(
               userId,
               "CREATE",
               nameof(Issue),
               issue.Id,
               null,
               newValue,
               ipAddress ?? "Unknown"
           );

            await _auditRepository.AddAsync(audit);

            await _unitOfWork.SaveChangesAsync();

            return new IssueResponseDto
            {
                Id = issue.Id,
                Title = issue.Title,
                Description = issue.Description,
                KomunaId = issue.KomunaId,
                IssueCategoryId = issue.IssueCategoryId,
                Status = issue.Status,
                Files = new List<MyTownFileResponseDto>()
            };
        }

        public async Task<IEnumerable<IssueResponseDto>> GetAllAsync()
        {
            var issues = await _issueRepository.GetAllAsync();
            var files = await _fileRepository.ReadFilesAsync();

            return issues.Select(issue => new IssueResponseDto
            {
                Id = issue.Id,
                Title = issue.Title,
                Description = issue.Description,

                KomunaId = issue.KomunaId,
                KomunaName = issue.Komuna?.Name,

                IssueCategoryId = issue.IssueCategoryId,
                CategoryName = issue.IssueCategory?.Title,

                Status = issue.Status,

                Files = files
                    .Where(f => f.Entity == ((int)FileEntityType.Issue).ToString()
                             && f.EntityId == issue.Id)
                    .Select(f => new MyTownFileResponseDto
                    {
                        Id = f.Id,
                        Entity = f.Entity,
                        EntityId = f.EntityId,
                        FileName = f.FileName,
                        FileUrl = $"https://localhost:7214{f.FilePath}",
                        FileSize = f.FileSize,
                        UploadedBy = f.UploadedBy,
                        CreatedAt = f.CreatedAt
                    }).ToList()
            });
        }

        public async Task<IssueCategoryResponseDto?> GetByIdAsync(int id)
        {
            var category = await _issueRepository.GetIssueByIdAsync(id);

            if (category == null)
                return null;

            return new IssueCategoryResponseDto
            {
                Id = category.Id,
                Title = category.Title,
                Description = category.Description
            };
        }

        public async Task UpdateIssueAsync(int id, UpdateIssueDto dto, int userId, string ipAddress)
        {
            var issue = await _issueRepository.GetIssueByIdAsync(id);

            if (issue == null)
                throw new Exception("Issue nuk u gjet.");

            var oldValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                issue.Title,
                issue.Description,
                issue.KomunaId,
                issue.IssueCategoryId
            });


            issue.Update(dto.Title,dto.Description,dto.IssueCategoryId, dto.Status, userId);

            await _issueRepository.Update(issue);

            var newValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                issue.Title,
                issue.Description,
                issue.KomunaId,
                issue.IssueCategoryId
            });

            var audit = new AuditLog(
                userId,
                "UPDATE",
                nameof(Issue),
                issue.Id,
                oldValue,
                newValue,
                ipAddress ?? "Unknown"
            );

            await _auditRepository.AddAsync(audit);

            await _unitOfWork.SaveChangesAsync();

           
            if (dto.Files != null && dto.Files.Count > 0)
            {
                foreach (var file in dto.Files)
                {
                    var result = await _fileService.SaveFileAsync(file);

                    var fileEntity = new MyTownFile(
                        ((int)FileEntityType.Issue).ToString(),
                        issue.Id,
                        result.fileName,
                        result.path,
                        result.size,
                        userId
                    );

                    await _fileRepository.AddFileAsync(fileEntity);
                }

                await _unitOfWork.SaveChangesAsync();
            }


        }

        public async Task DeleteAsync(int id, int userId, string ipAddress)
        {
            var issue = await _issueRepository.GetIssueByIdAsync(id);

            if (issue == null)
                throw new Exception("Issue nuk u gjet.");

            var oldValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                issue.Title,
                issue.Description,
                issue.IsDeleted
            });

         
            issue.Delete(userId);

            await _issueRepository.Update(issue);

            var newValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                issue.Title,
                issue.Description,
                issue.IsDeleted
            });

            var audit = new AuditLog(
                userId,
                "DELETE",
                nameof(Issue),
                issue.Id,
                oldValue,
                newValue,
                ipAddress ?? "Unknown"
            );

            await _auditRepository.AddAsync(audit);

            await _unitOfWork.SaveChangesAsync();
        }
    }
    }

