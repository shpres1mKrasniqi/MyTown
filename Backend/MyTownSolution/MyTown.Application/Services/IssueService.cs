

using MyTown.Application.DTOs.Issues;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
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
        public IssueService(IIssueRepository issueRepository, IUnitOfWork unitOfWork, IFileService fileService, IFileRepository fileRepository)
        {
            _issueRepository = issueRepository;
            _unitOfWork = unitOfWork;
            _fileService = fileService;
            _fileRepository = fileRepository;
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

            return new IssueResponseDto
            {
                Id = issue.Id,
                Title = issue.Title,
                Description = issue.Description,
                KomunaId = issue.KomunaId,
                IssueCategoryId = issue.IssueCategoryId,
                Status = issue.Status,
                Files = createIssueDto.Files
            };
        }
    }
}
