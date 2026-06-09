

namespace MyTown.Application.DTOs.Department
{
    public record DepartmentResponse(int Id, string Name, string Description, bool IsActive, int KomunaId, string KomunaName, DateTime CreatedAt, DateTime? UpdatedAt, int? CreatedBy, int? UpdatedBy);
}
