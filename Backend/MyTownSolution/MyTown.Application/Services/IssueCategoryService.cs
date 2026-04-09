

using MyTown.Application.DTOs.Issues;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Common;
using MyTown.Domain.Entities;


namespace MyTown.Application.Services
{
    public class IssueCategoryService : IIssueCategoryService
    {
        private readonly IIssueCategoryRepository _issueCategoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditRepository _auditRepository;
        public IssueCategoryService(IIssueCategoryRepository issueCategoryRepository, IUnitOfWork unitOfWork, IAuditRepository auditRepository)
        {
            _issueCategoryRepository = issueCategoryRepository;
            _unitOfWork = unitOfWork;
            _auditRepository = auditRepository; 
        }

        public async Task<IssueCategoryResponseDto> AddIssueCategoryAsync(CreateIssueCategoryDto createIssueCategoryDto, int adminId, string ipAddress)
        {
            var issueCategory = new IssueCategory(
                    createIssueCategoryDto.Title,
                    createIssueCategoryDto.Description,
                    adminId
                );
            
            await _issueCategoryRepository.AddIssueCategory(issueCategory);
           

            var auditi = new AuditLog
            (
                 adminId,
                "CREATE",
                "IssueCategory",
                issueCategory.Id,
                null,
                $"Kategoria e problemit u krijua me sukses: {issueCategory.Title}",
                ipAddress ?? "Unknown IP"
            );

            await _auditRepository.AddAsync(auditi);
            await _unitOfWork.SaveChangesAsync();

            return new IssueCategoryResponseDto
            {
                Id = issueCategory.Id,
                Title = issueCategory.Title,
                Description = issueCategory.Description
            };
        }

        public async Task<IEnumerable<IssueCategoryResponseDto>> GetAllAsync()
        {
            var categories = await _issueCategoryRepository.GetAllIssueCategoriesAsync();

            return categories.Select(ic => new IssueCategoryResponseDto
            {
                Id = ic.Id,
                Title = ic.Title,
                Description = ic.Description
            });
        }

        public async Task<IssueCategoryResponseDto?> GetByIdAsync(int id)
        {
            var category = await _issueCategoryRepository.GetIssueCategoryByIdAsync(id);

            if (category == null)
                return null;

            return new IssueCategoryResponseDto
            {
                Id = category.Id,
                Title = category.Title,
                Description = category.Description
            };
        }

        public async Task UpdateIssueCategoryAsync(int id, UpdateIssueCategoryDto dto, int adminId, string ipAddress)
        {
            var category = await _issueCategoryRepository.GetIssueCategoryByIdAsync(id);

            if (category == null)
                throw new Exception("Kategoria e problemit nuk u gjet.");

      
            var oldValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                category.Title,
                category.Description
            });


            category.Update(dto.Title, dto.Description, adminId);

           await _issueCategoryRepository.Update(category);


            var newValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                category.Title,
                category.Description
            });

         
            var audit = new AuditLog(
                adminId,
                "UPDATE",
                nameof(IssueCategory),
                category.Id,
                oldValue,
                newValue,
                ipAddress ?? "Unknown"
            );

            await _auditRepository.AddAsync(audit);

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id, int adminId, string ipAddress)
        {
            var category = await _issueCategoryRepository.GetIssueCategoryByIdAsync(id);

            if (category == null)
                throw new Exception("Kategoria e problemit nuk u gjet.");

            var oldValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                category.Title,
                category.Description,
                category.IsDeleted
            });

            category.Delete(adminId); 

            await _issueCategoryRepository.Delete(category);

            var newValue = System.Text.Json.JsonSerializer.Serialize(new
            {
                category.Title,
                category.Description,
                category.IsDeleted
            });

            var audit = new AuditLog(
                adminId,
                "DELETE",
                nameof(IssueCategory),
                category.Id,
                oldValue,
                newValue,
                ipAddress ?? "Unknown"
            );

            await _auditRepository.AddAsync(audit);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
