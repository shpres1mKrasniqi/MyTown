using MyTown.Domain.Common;

namespace MyTown.Domain
{
    public class ConstructionDocument : BaseEntity
    {
        public int ConstructionPermitRequestId { get; private set; }
        public ConstructionPermitRequest ConstructionPermitRequest { get; private set; }

        public string FilePath { get; private set; }
        public string FileName { get; private set; }

        public long FileSize { get; private set; }
        public DocumentType Type { get; private set; }

        private ConstructionDocument() { }

        public ConstructionDocument(int requestId, string filePath, string fileName, long fileSize, DocumentType type)
        {
            ConstructionPermitRequestId = requestId;
            FilePath = filePath;
            FileName = fileName;
            FileSize = fileSize;
            Type = type;
        }

        public void UpdateFile(string filePath, string fileName, DocumentType type)
        {
            FilePath = filePath;
            FileName = fileName;
            Type = type;
        }
    }
}