using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.Department
{
    public record DepartmentResponse(int Id, string Name, string Description, bool IsActive, int KomunaId, DateTime CreatedAt, DateTime? UpdatedAt, string? CreatedBy, string? UpdatedBy);
}
