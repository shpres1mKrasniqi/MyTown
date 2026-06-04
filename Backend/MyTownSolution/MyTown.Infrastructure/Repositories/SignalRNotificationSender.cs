using Microsoft.AspNetCore.SignalR;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Hubs;

public class SignalRNotificationSender : INotificationSender
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRNotificationSender(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(int userId, object data)
    {
        await _hubContext.Clients.Group($"user-{userId}").SendAsync("ReceiveNotification", data);
    }
}