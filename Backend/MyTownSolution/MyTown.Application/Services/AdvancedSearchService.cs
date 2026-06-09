using Microsoft.EntityFrameworkCore;
using MyTown.Application.DTOs.AdvancedSearch;
using MyTown.Application.DTOs.Citizens;
using MyTown.Application.DTOs.Department;
using MyTown.Application.DTOs.Files;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Domain.Enums;

namespace MyTown.Application.Services
{
    public class AdvancedSearchService : IAdvancedSearchService
    {
        private readonly IIssueRepository _issueRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly ICitizenRepository _citizen;

        public AdvancedSearchService(IIssueRepository issueRepository, IDepartmentRepository departmentRepository, ICitizenRepository citizenRepository)
        {
            _issueRepository = issueRepository;
            _departmentRepository = departmentRepository;
            _citizen = citizenRepository;
        }

        public async Task<PaginationResponse<IssueResponseDto>> SearchIssuesAsync(IssueSearch issueSearch)
        {
   
            var pageNumber = issueSearch.PageNumber <= 0 ? 1 : issueSearch.PageNumber;
            var pageSize = issueSearch.PageSize <= 0 || issueSearch.PageSize > 50 ? 10 : issueSearch.PageSize;

            var issues = _issueRepository.Query();

        
            if (issueSearch.MunicipalityId.HasValue)
            {
                issues = issues.Where(i => i.KomunaId == issueSearch.MunicipalityId);
            }

            if (issueSearch.FromDate.HasValue)
            {
                issues = issues.Where(i => i.CreatedAt >= issueSearch.FromDate);
            }

            if (issueSearch.ToDate.HasValue)
            {
                issues = issues.Where(i => i.CreatedAt <= issueSearch.ToDate);
            }

            if (issueSearch.Status.HasValue)
            {
                issues = issues.Where(i => i.Status == issueSearch.Status);
            }

            
            if (!string.IsNullOrWhiteSpace(issueSearch.SearchTerm))
            {
                var term = issueSearch.SearchTerm.Trim().ToLower();

                issues = issues.Where(i =>
                    i.Title.ToLower().Contains(term) ||
                    i.Description.ToLower().Contains(term));
            }

         
            var totalCount = await issues.CountAsync();

      
            issues = issueSearch.SortBy?.ToLower() switch
            {
                "date" => issueSearch.SortDescending
                    ? issues.OrderByDescending(i => i.CreatedAt)
                    : issues.OrderBy(i => i.CreatedAt),

                "title" => issueSearch.SortDescending
                    ? issues.OrderByDescending(i => i.Title)
                    : issues.OrderBy(i => i.Title),

                "status" => issueSearch.SortDescending
                    ? issues.OrderByDescending(i => i.Status)
                    : issues.OrderBy(i => i.Status),

                _ => issues.OrderByDescending(i => i.CreatedAt)
            };

        
            var result = await issues
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new IssueResponseDto
                {
                    Id = i.Id,
                    Title = i.Title,
                    Description = i.Description,

                    KomunaId = i.KomunaId,
                    KomunaName = i.Komuna.Name,

                    IssueCategoryId = i.IssueCategoryId,
                    CategoryName = i.IssueCategory.Title,

                    Status = i.Status,

                    Files = i.Files
                        .Where(f => f.Entity == ((int)FileEntityType.Issue).ToString())
                        .Select(f => new MyTownFileResponseDto
                        {
                            Id = f.Id,
                            Entity = f.Entity,
                            EntityId = f.EntityId,
                            FileName = f.FileName,
                            FileUrl = "https://localhost:7214" + f.FilePath,
                            FileSize = f.FileSize,
                            UploadedBy = f.UploadedBy,
                            CreatedAt = f.CreatedAt
                        }).ToList()
                })
                .ToListAsync();

            return new PaginationResponse<IssueResponseDto>
            {
                Items = result,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PaginationResponse<DepartmentResponse>> SearchDepartmentsAsync(DepartmentSearch query)
        {
            var pageNumber = query.PageNumber <= 0 ? 1 : query.PageNumber;
            var pageSize = query.PageSize <= 0 || query.PageSize > 50 ? 10 : query.PageSize;

                var departments = _departmentRepository.Query();


            if (query.MunicipalityId.HasValue)
            {
                departments = departments.Where(d => d.KomunaId == query.MunicipalityId);
            }

            if (!string.IsNullOrWhiteSpace(query.SearchTerm))
            {
                var term = query.SearchTerm.Trim().ToLower();

                departments = departments.Where(d =>
                    d.Name.ToLower().Contains(term) ||
                    d.Description.ToLower().Contains(term));
            }


            var totalCount = await departments.CountAsync();


            departments = query.SortBy?.ToLower() switch
            {
                "date" => query.SortDescending
                    ? departments.OrderByDescending(d => d.CreatedAt)
                    : departments.OrderBy(d => d.CreatedAt),
                    

                "title" => query.SortDescending
                    ? departments.OrderByDescending(d => d.Name)
                    : departments.OrderBy(d => d.Name),


                _ => departments.OrderByDescending(d => d.CreatedAt)
            };


            var result =  departments
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
               .Select(d => new DepartmentResponse(
                    d.Id,
                    d.Name,          
                    d.Description,
                    true,
                    d.KomunaId,
                     d.Komuna.Name,
                    d.CreatedAt,
                    d.UpdatedAt,
                    d.CreatedBy,
                    d.UpdatedBy
                )).ToList();

            return new PaginationResponse<DepartmentResponse>
            {
                Items = result,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PaginationResponse<CitizenResponseDto>> SearchCitizensAsync(CitizenSearch query)
        {
            var pageNumber = query.PageNumber <= 0 ? 1 : query.PageNumber;
            var pageSize = query.PageSize <= 0 || query.PageSize > 50 ? 10 : query.PageSize;

            var citizens = _citizen.Query();

            if (query.MunicipalityId.HasValue)
            {
                citizens = citizens.Where(i => i.KomunaId == query.MunicipalityId);
            }

            if (!string.IsNullOrWhiteSpace(query.FirstName))
            {
                var term = query.FirstName.Trim().ToLower();
                citizens = citizens.Where(c => c.User.FirstName.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(query.LastName))
            {
                var term = query.LastName.Trim().ToLower();
                citizens = citizens.Where(c => c.User.LastName.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(query.Email))
            {
                var term = query.Email.Trim().ToLower();
                citizens = citizens.Where(c => c.User.Email.ToLower().Contains(term));
            }

            var totalCount = await citizens.CountAsync();


            citizens = query.SortBy?.ToLower() switch
            {
                "date" => query.SortDescending
                    ? citizens.OrderByDescending(c => c.CreatedAt)
                    : citizens.OrderBy(c => c.CreatedAt),


                "firstName" => query.SortDescending
                    ? citizens.OrderByDescending(c => c.User.FirstName)
                    : citizens.OrderBy(c => c.User.FirstName),

                "lastName" => query.SortDescending
                   ? citizens.OrderByDescending(c => c.User.LastName)
                   : citizens.OrderBy(c => c.User.LastName),


                _ => citizens.OrderByDescending(c => c.CreatedAt)
            };

            var result = citizens
               .Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
                .Select(c => new CitizenResponseDto
                {
                    FirstName = c.User.FirstName,
                    LastName = c.User.LastName,
                    Address = c.Address,
                    PhoneNumber = c.PhoneNumber
                }).ToList();
     

            return new PaginationResponse<CitizenResponseDto>
            {
                Items = result,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

        }
    }
}