using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.History
{
    public class HistoryPdfRequestDto
    {
        public string? Type { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}
