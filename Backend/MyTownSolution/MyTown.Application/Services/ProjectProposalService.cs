

using MyTown.Application.DTOs.Files;
using MyTown.Application.DTOs.ProjectProposals;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;
using MyTown.Domain.Enums;
namespace MyTown.Application.Services
{
    public class ProjectProposalService : IProjectProposalService
    {
        private readonly IProjectProposalRepository _projectPropRepo;
        private readonly IAuditRepository _auditRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileRepository _fileRepo;
        private readonly IFileService _fileService;

        public ProjectProposalService(IProjectProposalRepository projectPropRepo, IAuditRepository auditRepository, IUnitOfWork unitOfWork, IFileRepository fileRepo, IFileService fileService)
        {
            _projectPropRepo = projectPropRepo;
            _auditRepo = auditRepository;
            _unitOfWork = unitOfWork;
            _fileRepo = fileRepo;
            _fileService = fileService;
        }

        public async Task<ProjectProposalResponseDto> AddProjectProposalAsync(CreateProposal proposal, int userId, string ipAddress)
        {
            if (proposal == null)
            {
                throw new Exception("Formati i projekt-propozimit eshte jovalid");
            }

            var projektPropozimi = new ProjectProposal
                    (
                proposal.Title,
                proposal.Description,
                proposal.Budget,
                proposal.PlannedStartDate,
                proposal.PlannedEndDate,
                proposal.TenderWinnerCompany,
                proposal.VotingDeadline,
                proposal.KomunaId
                );

            projektPropozimi.SetCreated(userId);

            await _projectPropRepo.AddProjectProposalAsync(projektPropozimi);
            await _unitOfWork.SaveChangesAsync();

            var uploadedFiles = new List<MyTownFileResponseDto>();

            if (proposal.Files != null && proposal.Files.Count > 0)
            {
                foreach (var file in proposal.Files)
                {
                    var result = await _fileService.SaveFileAsync(file, "project-proposals");

                    var fileEntity = new MyTownFile(
                        ((int)FileEntityType.ProjectProposal).ToString(),
                        projektPropozimi.Id,
                        result.fileName,
                        result.path,
                        result.size,
                        userId
                    );

                    fileEntity.ProjectProposalId = projektPropozimi.Id;

                    await _fileRepo.AddFileAsync(fileEntity);

                    uploadedFiles.Add(new MyTownFileResponseDto
                    {
                        FileName = fileEntity.FileName,
                        FileUrl = $"https://localhost:7214{fileEntity.FilePath}",
                        FileSize = fileEntity.FileSize
                    });
                }

                await _unitOfWork.SaveChangesAsync();
            }


            var newValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                projektPropozimi.Title,
                projektPropozimi.Description,
                projektPropozimi.KomunaId,
                projektPropozimi.Budget,
                projektPropozimi.VotingDeadline
            });

            var auditLog = new AuditLog
                (
                   userId,
                   "CREATE",
                   nameof(ProjectProposal),
                   projektPropozimi.Id,
                   null,
                   newValue,
                   ipAddress ?? "IP Adresa e Panjohur"
                );

            await _auditRepo.AddAsync(auditLog);
            await _unitOfWork.SaveChangesAsync();

            return new ProjectProposalResponseDto
            {
                Id = projektPropozimi.Id,
                Title = projektPropozimi.Title,
                Description = projektPropozimi.Description,
                Budget = projektPropozimi.Budget,
                PlannedStartDate = projektPropozimi.PlannedStartDate,
                PlannedEndDate = projektPropozimi.PlannedEndDate,
                TenderWinnerCompany = projektPropozimi.TenderWinnerCompany,
                VotingDeadline = projektPropozimi.VotingDeadline,
                Status = projektPropozimi.Status,
                KomunaId = projektPropozimi.KomunaId,
                Files = projektPropozimi.Files?.Select(f => new MyTownFileResponseDto  
                {
                    Id = f.Id,
                    FileName = f.FileName,
                    FileUrl = $"https://localhost:7214{f.FilePath}",
                    FileSize = f.FileSize,
                }).ToList() ?? new()
            };


        }
    }
}
