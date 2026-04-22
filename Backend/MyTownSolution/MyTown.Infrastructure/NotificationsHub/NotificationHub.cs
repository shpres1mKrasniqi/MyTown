using Microsoft.AspNetCore.SignalR;

namespace MyTown.Infrastructure.Hubs
{
   
    public class NotificationHub : Hub
    {
        
        public async Task JoinStaffGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Staff");
        }
    }
}