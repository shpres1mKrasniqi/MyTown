using Microsoft.AspNetCore.SignalR;
using MyTown.API.Hubs.Problems;
using MyTown.Application.DTOs.Issues;
using MyTown.Application.Ports.OutboundPorts;

namespace MyTown.API.Services;

public class RealtimeInteractionNotifier : IRealtimeInteractionNotifier
{
    private readonly IHubContext<ProblemHub> _hub;

    public RealtimeInteractionNotifier(IHubContext<ProblemHub> hub)
    {
        _hub = hub;
    }

    public Task NotifyLikeUpdatedAsync(int postId, int likeCount, int userId, bool likedByCurrentUser, CancellationToken cancellationToken = default)
    {
        return _hub.Clients.All.SendAsync(
            "LikeUpdated",
            new { postId, likeCount, userId, likedByCurrentUser },
            cancellationToken);
    }

    public Task NotifyCommentAddedAsync(int postId, PostCommentDto comment, CancellationToken cancellationToken = default)
    {
        return _hub.Clients.All.SendAsync("CommentAdded", new { postId, comment }, cancellationToken);
    }
}
