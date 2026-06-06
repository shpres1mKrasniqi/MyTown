using MyTown.Application.DTOs.Files;
using MyTown.Domain.Enums;

public class IssueResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    public int KomunaId { get; set; }
    public string KomunaName { get; set; }

    public string CitizenName { get; set; }

    public int IssueCategoryId { get; set; }
    public string CategoryName { get; set; }

    public IssueStatus Status { get; set; }

    public List<MyTownFileResponseDto> Files { get; set; }
}