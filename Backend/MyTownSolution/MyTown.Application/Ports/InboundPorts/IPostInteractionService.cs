using MyTown.Application.DTOs.Issues;

namespace MyTown.Application.Ports.InboundPorts;

public interface IPostInteractionService
{
    Task<PostLikeSummaryDto> GetLikeSummaryAsync(int postId, int? currentUserId, CancellationToken cancellationToken = default);

    Task<ToggleLikeResultDto> ToggleLikeAsync(int postId, int userId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PostCommentDto>> GetCommentsAsync(int postId, CancellationToken cancellationToken = default);

    Task<PostCommentDto> AddCommentAsync(int postId, int userId, CreatePostCommentDto dto, CancellationToken cancellationToken = default);
}
