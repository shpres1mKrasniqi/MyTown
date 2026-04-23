using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Application.Ports.InboundPorts;
using Microsoft.AspNetCore.SignalR;



namespace MyTown.Application.Services
{
    public  class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUnitOfWork _unitRepository;
        private readonly INotificationSender _notificationSender;

        public NotificationService(INotificationRepository notificationRepository, IUnitOfWork unitRepository, INotificationSender notificationSender)
        {
            _notificationRepository = notificationRepository;
            _unitRepository = unitRepository;
            _notificationSender = notificationSender;
        }
        public async Task CreateNotificationAsync(int userId, string message)
        {
            var notification = new Notifications(userId, message);

            await _notificationRepository.AddAsync(notification);
            await _unitRepository.SaveChangesAsync();
            notification.SetCreated(userId);

            await _notificationSender.SendNotificationAsync(userId, new
            {
                id = notification.Id,
                message = message,
                createdAt = notification.CreatedAt,
                isRead = notification.IsRead
            });
        }
        public async Task<List<Notifications>> GetByUserIdAsync(int userId)
        {
            return await _notificationRepository.GetByUserIdAsync(userId);
        
        }
        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await _notificationRepository.GetByIdAsync(notificationId);

          
            if (notification == null)
            
                throw new Exception("Njoftimi nuk u gjet");
            notification.MarkAsRead();

            await _unitRepository.SaveChangesAsync();

        }
        public async Task MarkAllAsReadAsync(int userId)
        {
            var notifications = await _notificationRepository.GetByUserIdAsync(userId);
            foreach (var n in notifications)
            {
                if(!n.IsRead)
                    n.MarkAsRead();
            }
            await _unitRepository.SaveChangesAsync();
        }
    }
}
