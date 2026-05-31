using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.History
{
    public class MunicipalityHistoryDto
    {
        public int Id { get; set; }
        public string EntityType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string? Location { get; set; }
        public string? Status { get; set; }


    }
}
