using Microsoft.AspNetCore.Http;

namespace MyTown.Application
{
    public class UpdateConstructionDocumentsDto
    {
        public int RequestId { get; set; }

        public List<CreateConstructionDocumentDto> Documents { get; set; } = new();
    }
}