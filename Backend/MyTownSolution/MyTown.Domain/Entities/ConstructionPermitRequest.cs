using MyTown.Domain.Common;
using MyTown.Domain.Entities;

namespace MyTown.Domain
{
    public class ConstructionPermitRequest : BaseEntity
    {
        public int CitizenId { get; private set; }
        public CitizenProfile Citizen { get; private set; }

        public string Title { get; private set; }
        public string Description { get; private set; }

        public PermitReqStatus Status { get; private set; }
        public bool IsDeleted { get; private set; }

        public ICollection<ConstructionDocument> ConstructionDocuments { get; private set; } = new List<ConstructionDocument>();

        private ConstructionPermitRequest() { }

        public ConstructionPermitRequest(int citizenId, string title, string description)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title is required");

            CitizenId = citizenId;
            Title = title;
            Description = description;
            Status = PermitReqStatus.NePritje;
            IsDeleted = false;

            SetCreated(citizenId);
        }

        public void AddDocument(string filePath, string fileName, long fileSize, DocumentType type)
        {
            if (ConstructionDocuments.Any(d => d.Type == type))
                throw new Exception($"Document of type {type} already exists.");

            ConstructionDocuments.Add(new ConstructionDocument(Id, filePath, fileName, fileSize, type));
        }

        public void UpdateRequestStatus(PermitReqStatus status, int staffId)
        {
            Status = status;
            SetUpdated(staffId);
        }

        public void SoftDelete(int citizenId)
        {
            IsDeleted = true;
            SetUpdated(citizenId);
        }
    }
}