

using MyTown.Domain.Common;
using MyTown.Domain.Enums;

namespace MyTown.Domain.Entities
{
    public class ProjectProposal : BaseEntity
    {
        public string Title { get; private set; } = null!;
        public string Description { get; private set; } = null!;

        public decimal Budget { get; private set; }

        public DateTime? PlannedStartDate { get; private set; }
        public DateTime? PlannedEndDate { get; private set; }

        public string? TenderWinnerCompany { get; private set; }

        public DateTime VotingDeadline { get; private set; }

        public ProjectProposalStatus Status { get; private set; }

        public bool IsDeleted { get; private set; }

        public int KomunaId { get; private set; }
        public Komuna Komuna { get; private set; } = null!;

        public ICollection<MyTownFile> Files { get; private set; } = new List<MyTownFile>();

        private ProjectProposal() { }

        public ProjectProposal(


            string title,
            string description,
            decimal budget,
            DateTime? plannedStartDate,
            DateTime? plannedEndDate,
            string? tenderWinnerCompany,
            DateTime votingDeadline,
            int komunaId)
        {

            if (budget < 0)
                throw new Exception("Buxheti nuk mund të jetë negativ.");

            if (votingDeadline <= DateTime.UtcNow)
                throw new Exception("Afati i votimit duhet të jetë në të ardhmen.");

            if (plannedStartDate.HasValue && plannedEndDate.HasValue &&
                plannedEndDate < plannedStartDate)
                throw new Exception("Data e përfundimit nuk mund të jetë para datës së fillimit.");

      
            Title = title;
            Description = description;
            Budget = budget;
            PlannedStartDate = plannedStartDate;
            PlannedEndDate = plannedEndDate;
            TenderWinnerCompany = tenderWinnerCompany;
            VotingDeadline = votingDeadline;
            KomunaId = komunaId;
            Status = ProjectProposalStatus.Active;
            IsDeleted = false;
           
        }

        public bool IsVotingOpen()
        {
            return DateTime.UtcNow <= VotingDeadline &&
                   Status == ProjectProposalStatus.Active &&!IsDeleted;
        }

        public void Update(
            string title,
            string description,
            decimal budget,
            DateTime? plannedStartDate,
            DateTime? plannedEndDate,
            string? tenderWinnerCompany,
            DateTime votingDeadline,
            int komunaId,
            int userId
            )
        {
            Title = title;
            Description = description;
            Budget = budget;
            PlannedStartDate = plannedStartDate;
            PlannedEndDate = plannedEndDate;
            TenderWinnerCompany = tenderWinnerCompany;
            VotingDeadline = votingDeadline;
            KomunaId = komunaId;
           

            SetUpdated(userId);
        }
        public void CloseVoting(int userId)
        {
            Status = ProjectProposalStatus.VotingClosed;
            SetUpdated(userId);
        }

        public void Delete(int userId)
        {
            IsDeleted = true;
            SetUpdated(userId);
        }
    }
}
