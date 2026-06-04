using MyTown.Domain.Common;
using MyTown.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Domain.Entities
{
    public class Notifications : BaseEntity
    {
        public int UserId { get; private set; }
        public string Title { get; private set; }
        public string Message { get; private set; }
        public NotificationType Type { get; private set; }
        public bool IsRead { get; private set; }


        protected Notifications() { }


        public Notifications(int userId,string title, string message, NotificationType type)
        {
            UserId = userId;
            Title = title;
            Message = message;
            Type = type;
            IsRead = false;
            CreatedAt = DateTime.UtcNow;
        }
        public void MarkAsRead()
        {
            IsRead = true;
        }
    }
}
