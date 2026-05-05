using Microsoft.AspNetCore.SignalR;

namespace MyTown.API.Hubs.Problems
{
    public class EventHub : Hub
    {
<<<<<<< HEAD
        // Qytetarët join-ojnë group-in e komunës së tyre
        public async Task JoinKomunaGroup(string komunaId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"komuna-{komunaId}");
        }

        public async Task LeaveKomunaGroup(string komunaId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"komuna-{komunaId}");
        }
        public async Task JoinCitizenGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Citizens");
        }
=======
<<<<<<< Updated upstream

=======
        
>>>>>>> Stashed changes
>>>>>>> e43f6f4 (Implementimi i valdimit per Events duke perdorur fluent-validation)
    }
}

