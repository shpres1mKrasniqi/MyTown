using Microsoft.AspNetCore.SignalR;

namespace MyTown.Infrastructure.Hubs
{
   
    public class NotificationHub : Hub
    {
        
        public async Task JoinStaffGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Staff");
        }
        public async Task JoinCitizenGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Citizens");
        }
        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
        }
    }
}