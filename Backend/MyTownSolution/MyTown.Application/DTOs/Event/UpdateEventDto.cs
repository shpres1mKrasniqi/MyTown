using MyTown.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.Event
{
    public class UpdateEventDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public string Location { get; set; }
        public EventStatus Status { get; set; }
    }
}
