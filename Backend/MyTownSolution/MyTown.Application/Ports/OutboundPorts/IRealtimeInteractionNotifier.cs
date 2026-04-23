using MyTown.Application.DTOs.Issues;

namespace MyTown.Application.Ports.OutboundPorts;

public interface IRealtimeInteractionNotifier
{
    Task NotifyLikeUpdatedAsync(int postId, int likeCount, int userId, bool likedByCurrentUser, CancellationToken cancellationToken = default);

    Task NotifyCommentAddedAsync(int postId, PostCommentDto comment, CancellationToken cancellationToken = default);
}
