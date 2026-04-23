using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(int userId, string message);
        Task<List<Notifications>> GetByUserIdAsync(int userId);
        Task MarkAsReadAsync(int notificationId);
        Task MarkAllAsReadAsync(int uerId);
    }
}
