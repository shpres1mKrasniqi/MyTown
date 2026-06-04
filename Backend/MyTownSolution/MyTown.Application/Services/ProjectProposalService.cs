

using Microsoft.IdentityModel.Tokens;
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
        private readonly INotificationService _notificationService;
        private readonly ICitizenRepository _citizenRepo;

        public ProjectProposalService(IProjectProposalRepository projectPropRepo, IAuditRepository auditRepository, IUnitOfWork unitOfWork, IFileRepository fileRepo, IFileService fileService, INotificationService notificationService, ICitizenRepository citizenRepo)
        {
            _projectPropRepo = projectPropRepo;
            _auditRepo = auditRepository;
            _unitOfWork = unitOfWork;
            _fileRepo = fileRepo;
            _fileService = fileService;
            _notificationService = notificationService;
            _citizenRepo = citizenRepo;
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

            var citizens = await _citizenRepo.GetByKomunaIdAsync(projektPropozimi.KomunaId);
            foreach (var citizen in citizens)
            {
                await _notificationService.CreateNotificationAsync(
                    citizen.UserId,
                    "Projekt propzoim i ri",
                    $"Nje propozim projekti i ri eshte publikuar: Titulli: {projektPropozimi.Title}",
                    NotificationType.ProjectProposal
                    );
            }

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
                        Entity = fileEntity.Entity,
                        EntityId = fileEntity.EntityId,
                        FileName = fileEntity.FileName,
                        FileUrl = $"https://localhost:7214{fileEntity.FilePath}",
                        FileSize = fileEntity.FileSize,
                        UploadedBy = fileEntity.UploadedBy,
                        CreatedAt = fileEntity.CreatedAt
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
                Files = projektPropozimi.Files?.Where(f => !f.IsDeleted).Select(f => new MyTownFileResponseDto
                {
                    Id = f.Id,
                    FileName = f.FileName,
                    FileUrl = $"https://localhost:7214{f.FilePath}",
                    FileSize = f.FileSize,
                }).ToList() ?? new()
            };


        }

        public async Task<ProjectProposalResponseDto> GetProjectProposalByIdAsync(int proposalId)
        {
            var projPropozimi = await _projectPropRepo.GetProjectProposalsByIdAsync(proposalId);

            if (projPropozimi == null)
            {
                return null;
            }

            return new ProjectProposalResponseDto
            {
                Id = projPropozimi.Id,
                Title = projPropozimi.Title,
                Description = projPropozimi.Description,
                Budget = projPropozimi.Budget,
                PlannedStartDate = projPropozimi.PlannedStartDate,
                PlannedEndDate = projPropozimi.PlannedEndDate,
                TenderWinnerCompany = projPropozimi.TenderWinnerCompany,
                VotingDeadline = projPropozimi.VotingDeadline,
                Status = projPropozimi.Status,
                KomunaId = projPropozimi.KomunaId,
                Files = projPropozimi.Files?.Where(f => !f.IsDeleted).Select(f => new MyTownFileResponseDto
                {
                    Id = f.Id,
                    FileName = f.FileName,
                    FileUrl = $"https://localhost:7214{f.FilePath}",
                    FileSize = f.FileSize,
                }).ToList() ?? new()
            };
        }

        public async Task<IEnumerable<ProjectProposalResponseDto>> GetAllProjectProposalsAsync()
        {
            var proposals = await _projectPropRepo.GetAllProposalsAsync();

            if (proposals == null || !proposals.Any())
            {
                return Enumerable.Empty<ProjectProposalResponseDto>();
            }

            return proposals.Select(projPropozimi => new ProjectProposalResponseDto
            {
                Id = projPropozimi.Id,
                Title = projPropozimi.Title,
                Description = projPropozimi.Description,
                Budget = projPropozimi.Budget,
                PlannedStartDate = projPropozimi.PlannedStartDate,
                PlannedEndDate = projPropozimi.PlannedEndDate,
                TenderWinnerCompany = projPropozimi.TenderWinnerCompany,
                VotingDeadline = projPropozimi.VotingDeadline,
                Status = projPropozimi.Status,
                KomunaId = projPropozimi.KomunaId,
                Files = projPropozimi.Files?.Where(f => !f.IsDeleted).Select(f => new MyTownFileResponseDto
                {
                    Id = f.Id,
                    FileName = f.FileName,
                    FileUrl = $"https://localhost:7214{f.FilePath}",
                    FileSize = f.FileSize,
                }).ToList() ?? new()
            });
        }

        public async Task SoftDeleteProposalAsync(int id, int staffId, string ipAddress)
        {
            var propozimi = await _projectPropRepo.GetProjectProposalsByIdAsync(id);

            if (propozimi == null || propozimi.IsDeleted)
            {
                throw new Exception("ID e projekt-propozimit nuk u gjet");
            }

            propozimi.Delete(staffId);

            _projectPropRepo.DeleteProposalAsync(propozimi);

            await _auditRepo.AddAsync(new AuditLog(
                staffId,
                "SoftDelete",
                "ProjectProposal",
                propozimi.Id,
                null,
                $"ProjectProposal me ID {propozimi.Id} u fshi.",
                ipAddress
                ));

            await _unitOfWork.SaveChangesAsync();

        }

        public async Task UpdateAsync(int id, UpdateProjectProposalDto dto, int staffId, string ipAddress)
        {

            var projektPropozimi = await _projectPropRepo.GetProjectProposalsByIdAsync(id);

            if (projektPropozimi == null || projektPropozimi.IsDeleted)
            {
                throw new Exception("ID e projekt-propozimit nuk u gjet");
            }

            projektPropozimi.Update(
            dto.Title,
            dto.Description,
            dto.Budget,
            dto.PlannedStartDate,
            dto.PlannedEndDate,
            dto.TenderWinnerCompany,
            dto.VotingDeadline,
            dto.KomunaId,
                    staffId
            );

             _projectPropRepo.UpdateProposalAsync(projektPropozimi);

            if (dto.Files != null && dto.Files.Count > 0)
            {
                foreach (var file in dto.Files)
                {
                    var result = await _fileService.SaveFileAsync(file, "project-proposals");

                    var fileEntity = new MyTownFile(
                        ((int)FileEntityType.ProjectProposal).ToString(),
                        projektPropozimi.Id,
                        result.fileName,
                        result.path,
                        result.size,
                        staffId
                    );

                    fileEntity.ProjectProposalId = projektPropozimi.Id;

                    await _fileRepo.AddFileAsync(fileEntity);
                }
            }

            if (dto.DeletedFileIds != null && dto.DeletedFileIds.Count > 0)
            {
                foreach (var fileId in dto.DeletedFileIds)
                {
                    var file = projektPropozimi.Files
                        .FirstOrDefault(x => x.Id == fileId);

                    if (file != null)
                    {
                        file.Delete();
                        _fileRepo.DeleteFile(file);
                    }
                }
            }

            

            await _auditRepo.AddAsync(new AuditLog(
               staffId,
               "Update",
               "ProjectProposal",
               projektPropozimi.Id,
               null,
               $"ProjectProposal me ID {projektPropozimi.Id} u perditesua.",
               ipAddress
               ));

           
            await _unitOfWork.SaveChangesAsync();

        }
    }
}
