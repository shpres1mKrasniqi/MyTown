using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface INotificationSender
    {
        Task SendNotificationAsync(int userId, object data);
    }
}
