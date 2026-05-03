using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace MyTown.Application.DTOs.Event
{
    public class CreateEventDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public string Location { get; set; }
        public int StaffId { get; set; }

        public List<IFormFile>? Files { get; set; }
    }
}
