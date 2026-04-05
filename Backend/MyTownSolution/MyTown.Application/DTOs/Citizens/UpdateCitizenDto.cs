using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.Citizens
{
    public class UpdateCitizenDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; }
        public string Email { get; set; }
        public int KomunaId { get; set; }   
        public string PhoneNumber { get; set; } 
        public string Address { get; set; } 

    }
}
