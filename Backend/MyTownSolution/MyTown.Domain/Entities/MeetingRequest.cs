

using MyTown.Domain.Common;
using MyTown.Domain.Enums;

namespace MyTown.Domain.Entities
{
    public class MeetingRequest : BaseEntity
    {
        public int CitizenId { get; private set; }

        public CitizenProfile Citizen { get; private set; }

        public string Title { get; private set; }

        public string Reason { get; private set; }

        public MeetingRequestStatus Status { get; private set; }

        public DateOnly DateOfMeeting {  get; private set; }

        public bool IsDeleted { get; private set; }


        private MeetingRequest() { }


        public MeetingRequest(int citizenId, string title, string reason,DateOnly dateOfMeeting)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Titulli është i nevojshëm");

            if (dateOfMeeting < DateOnly.FromDateTime(DateTime.Now))
                throw new ArgumentException("Data e takimit nuk mund të jetë në të kaluarën");

            if (string.IsNullOrWhiteSpace(reason))
                throw new ArgumentException("Arsyeja është e nevojshme");

            CitizenId = citizenId;
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
