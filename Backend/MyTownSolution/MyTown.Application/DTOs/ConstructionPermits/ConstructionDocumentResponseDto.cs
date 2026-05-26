using MyTown.Domain;

namespace MyTown.Application
{
    public class ConstructionDocumentResponseDto
    {
        public int Id { get; set; }

        public string FileName { get; set; }
        public string FileUrl { get; set; }

        public DocumentType Type { get; set; }
    }
}