using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.Department
{
    public record CreateDepartment(string Name, string Description, int KomunaId);
}
