namespace MyTown.Application.DTOs.Issues;

public class PostLikeSummaryDto
{
    public int PostId { get; set; }
    public int LikeCount { get; set; }
    public bool LikedByCurrentUser { get; set; }
}

public class ToggleLikeResultDto
{
    public int PostId { get; set; }
    public int LikeCount { get; set; }
    public bool LikedByCurrentUser { get; set; }
}

public class PostCommentDto
{
    public string Id { get; set; } = string.Empty;
    public int PostId { get; set; }
    public int UserId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreatePostCommentDto
{
    public string Content { get; set; } = string.Empty;
}
