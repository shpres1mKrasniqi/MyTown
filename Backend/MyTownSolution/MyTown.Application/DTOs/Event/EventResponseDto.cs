using MyTown.Application.DTOs.Files;
using MyTown.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.Event
{
    public class EventResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public string Location { get; set; }
        public int KomunaId { get; set; }
        public string KomunaName { get; set; }
        public int StaffId { get; set; }
        public string StaffName { get; set; }
        public EventStatus Status { get; set; }
        public int VoteCount { get; set; }
        public bool HasVoted { get; set; }
        public List<MyTownFileResponseDto> Files { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}
