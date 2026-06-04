using MyTown.Domain.Entities;
using MyTown.Domain.Enums;
namespace MyTown.Application.Ports.InboundPorts
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(int userId,string title, string message, NotificationType type);
        Task<List<Notifications>> GetByUserIdAsync(int userId);
        Task MarkAsReadAsync(int notificationId);
        Task MarkAllAsReadAsync(int uerId);
    }
}
