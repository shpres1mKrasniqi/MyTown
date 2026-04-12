
using MyTown.Domain.Common;
using MyTown.Domain.Enums;

namespace MyTown.Domain.Entities
{
    public class Issue : BaseEntity
    {
        public string Title { get; private set; }

        public string Description { get; private set; }

        public int CitizenId { get; private set; }

        public int KomunaId { get; private set; }

        public Komuna Komuna { get; private set; }
        public CitizenProfile Citizen { get; private set; }
        public IssueStatus Status { get; private set; }

        public bool IsDeleted { get; private set; }

        public int IssueCategoryId { get; private set; }

        public IssueCategory IssueCategory { get; private set; }

        public ICollection<MyTownFile> Files { get; private set; } = new List<MyTownFile>();
        protected Issue() { }

        public Issue(string title, string description, int issueCategoryId, int citizenId, int komunaId, IssueStatus status, int createdBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Titulli duhet plotesu");

            if (string.IsNullOrWhiteSpace(description))
                throw new ArgumentException("Pershkrimi duhet plotesuar");

            Title = title;
            Description = description;
            IssueCategoryId = issueCategoryId;
            CitizenId = citizenId;
            KomunaId = komunaId;
            Status = IssueStatus.Pending;
            IsDeleted = false;
            SetCreated(createdBy);
        }

        public void Update(string title, string description, int issueCategoryId, IssueStatus status, int userId)
        {
            Title = title;
            Description = description;
            IssueCategoryId = issueCategoryId;
            Status = status;
            UpdatedAt = DateTime.UtcNow;
            SetUpdated(userId);
        }

        public void Delete(int userId)
        {
            IsDeleted = true;
            UpdatedAt = DateTime.UtcNow;
            SetUpdated(userId);
        }
    }
}
