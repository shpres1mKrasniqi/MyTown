using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.Staff
{
    public class UpdateStaffDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; }
        public string Email { get; set; } = null!;
        public string Position { get; set; } = null!;   
        public DateTime? DateHired { get; set; } 
        public int DepartmentId { get; set; }
    }
}
