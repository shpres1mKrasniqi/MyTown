
namespace MyTown.Domain.Entities
{
    public class MyTownFile
    {
        public int Id { get; private set; }

        public string Entity { get; private set; }

        public int EntityId { get; private set; }

        public string FileName { get; private set; }
        public string FilePath { get; private set; }

        public long FileSize { get; private set; }

        public int UploadedBy { get; private set; }

        public DateTime CreatedAt { get; private set; }


        public int? IssueId { get; set; }
        public int? EventId { get; set; }

        public int? ProjectProposalId { get; set; }
        protected MyTownFile() { }

        public MyTownFile(string entity, int entityId, string fileName, string filePath, long fileSize, int uploadedBy)
        {
            Entity = entity;
            EntityId = entityId;
            FileName = fileName;
            FilePath = filePath;
            FileSize = fileSize;
            UploadedBy = uploadedBy;
            CreatedAt = DateTime.UtcNow;
        }


    }
}
