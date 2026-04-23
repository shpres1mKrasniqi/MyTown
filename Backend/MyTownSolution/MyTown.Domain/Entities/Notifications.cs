using MyTown.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Domain.Entities
{
    public class Notifications : BaseEntity
    {
        public int UserId { get; private set; }
        public string Message { get; private set; }
        public bool IsRead { get; private set; }


        protected Notifications() { }


        public Notifications(int userId, string message)
        {
            UserId = userId;
            Message = message;
            IsRead = false;
            CreatedAt = DateTime.UtcNow;
        }
        public void MarkAsRead()
        {
            IsRead = true;
        }
    }
}
