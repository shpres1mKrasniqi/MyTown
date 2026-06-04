using MyTown.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.DTOs.Notifications
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public NotificationType Type { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
