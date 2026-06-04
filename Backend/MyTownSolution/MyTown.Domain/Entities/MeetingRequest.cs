

using MyTown.Domain.Common;
using MyTown.Domain.Enums;

namespace MyTown.Domain.Entities
{
    public class MeetingRequest : BaseEntity
    {
        public int CitizenId { get; private set; }

        public CitizenProfile Citizen { get; private set; }
        public int KomunaId { get; private set; }

        public string Title { get; private set; }

        public string Reason { get; private set; }

        public MeetingRequestStatus Status { get; private set; }

        public DateTime DateOfMeeting { get; private set; }

        public bool IsDeleted { get; private set; }


        private MeetingRequest() { }


        public MeetingRequest(int citizenId,int komunaId, string title, string reason, DateTime dateOfMeeting)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Titulli është i nevojshëm");

            if (dateOfMeeting < DateTime.Now)
                throw new ArgumentException("Data e takimit nuk mund të jetë në të kaluarën");

            if (string.IsNullOrWhiteSpace(reason))
                throw new ArgumentException("Arsyeja është e nevojshme");

            CitizenId = citizenId;
            KomunaId = komunaId;
            Title = title;
            Reason = reason;
            DateOfMeeting = dateOfMeeting;
            Status = MeetingRequestStatus.Pending;
            IsDeleted = false;
            SetCreated(citizenId);
        }

        public void UpdateStatus(MeetingRequestStatus newStatus, int staffId)
        {
            Status = newStatus;
            SetUpdated(staffId);
        }

        public void DeleteRequest(int citizenId)
        {
            IsDeleted = true;
            SetUpdated(citizenId);
        }
    }
}
