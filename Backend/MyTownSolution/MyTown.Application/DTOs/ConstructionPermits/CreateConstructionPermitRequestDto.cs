

namespace MyTown.Application
{
    public class CreateConstructionPermitRequestDto
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public List<CreateConstructionDocumentDto> Documents { get; set; } = new();
    }
}