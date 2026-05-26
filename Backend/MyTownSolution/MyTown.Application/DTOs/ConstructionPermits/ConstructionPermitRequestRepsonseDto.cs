using MyTown.Domain;

namespace MyTown.Application
{
    public class ConstructionPermitRequestResponseDto
    {
        public int Id { get; set; }

        public int CitizenId { get; set; }
        public string CitizenName { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public PermitReqStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<ConstructionDocumentResponseDto> Documents { get; set; } = new();
    }
}