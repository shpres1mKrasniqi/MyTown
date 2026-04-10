
using Microsoft.AspNetCore.Http;
using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.Issues
{
    public class IssueResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int KomunaId { get; set; }
        public int IssueCategoryId { get; set; }

        public IssueStatus Status { get; set; }

        public List<IFormFile> Files { get; set; }
    }
}
