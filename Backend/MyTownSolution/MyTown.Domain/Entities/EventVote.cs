using MyTown.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Domain.Entities
{
    public class EventVote : BaseEntity
    {
        public int EventId { get; private set; }
        public int CitizenId { get; private set; }

        public Event Event { get; private set; }
        public CitizenProfile Citizen {  get; private set; }

        protected EventVote() { }

        public EventVote(int eventId, int citizenId, int createdBy)
        {
            EventId = eventId;
            CitizenId = citizenId;
            SetCreated (createdBy);
        }
    }
}
