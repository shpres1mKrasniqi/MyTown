using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Application.Ports.InboundPorts;

namespace MyTown.Application.Services
{
    public  class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUnitOfWork _unitRepository;

        public NotificationService(INotificationRepository notificationRepository, IUnitOfWork unitRepository)
        {
            _notificationRepository = notificationRepository;
            _unitRepository = unitRepository;
        }
        public async Task CreateNotificationAsync(int userId, string message)
        {
            var notification = new Notifications(userId, message);
            await _notificationRepository.AddAsync(notification);
            await _unitRepository.SaveChangesAsync();
        }
    }
}
