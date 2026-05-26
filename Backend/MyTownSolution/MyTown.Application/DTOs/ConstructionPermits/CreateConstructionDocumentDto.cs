using Microsoft.AspNetCore.Http;
using MyTown.Domain;

namespace MyTown.Application
{
    public class CreateConstructionDocumentDto
    {
        public IFormFile File { get; set; }
        public DocumentType Type { get; set; }
    }
}