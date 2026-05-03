using MyTown.Domain.Common;
using MyTown.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Domain.Entities
{
    public class Event : BaseEntity
    {
        public string Title { get; private set; }
        public string Description { get; private set; }
        public DateTime EventDate { get; private set; }
        public string Location { get; private set; }
        public int KomunaId { get; private set; }
        public int StaffId { get; private set; }
        public EventStatus Status { get; private set; }
        public bool IsDeleted { get; private set; }

        public StaffProfile StaffProfile { get; private set; }
        public Komuna Komuna   { get; private set; }
        public ICollection<EventVote> Votes { get; private set; } = new List<EventVote>();
        public ICollection<MyTownFile> Files { get; private set; } = new List<MyTownFile>();

        protected Event() { }

        public Event(string title, string description, DateTime eventDate, string location, int komunaId, int staffId, int createdBy)
        {
            if(string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title is required.", nameof(title));
            if(string.IsNullOrWhiteSpace(description))
                throw new ArgumentException("Description is required.", nameof(description));

            Title = title;
            Description = description;
            EventDate = eventDate;
            Location = location;
            KomunaId = komunaId;
            StaffId = staffId;
            Status = EventStatus.Draft;
            IsDeleted = false;
            SetCreated(createdBy);

        }
        public void Publish(int userId)
        {
            if(Status !=EventStatus.Draft)
                throw new InvalidOperationException("Vetem eventet me status: DRAFT mund te publikohen.");

            Status = EventStatus.Published;
            UpdatedAt = DateTime.UtcNow;
            SetUpdated(userId);

        }
        public void Update(string title, string description, DateTime eventDate,string location, EventStatus status, int userId)
        {
            Title = title;
            Description = description;
            EventDate = eventDate;
            Location = location;
            Status = status;
            UpdatedAt = DateTime.UtcNow;
            SetUpdated(userId);
        }
        public void Delete(int userId)
        {
            IsDeleted = true;
            SetUpdated(userId);
        }
        public int VoteCount => Votes?.Count ?? 0;
    }
}
