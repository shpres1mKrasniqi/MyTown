using MyTown.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface INotificationRepository
    {
        Task AddAsync(Notifications notifications);
        Task<List<Notifications>> GetByUserIdAsync(int userId);
        Task<Notifications?> GetByIdAsync(int id);

    }
}
