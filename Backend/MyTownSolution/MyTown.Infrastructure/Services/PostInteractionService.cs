using MongoDB.Driver;
using MyTown.Application.DTOs.Issues;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Infrastructure.Persistence.Mongo;
using MyTown.Infrastructure.Persistence.Mongo.Documents;

namespace MyTown.Infrastructure.Services;

public class PostInteractionService : IPostInteractionService
{
    private readonly MongoDbContext _mongo;
    private readonly IIssueRepository _issueRepository;
    private readonly IUserRepository _userRepository;
    private readonly IRealtimeInteractionNotifier _realtime;

    public PostInteractionService(
        MongoDbContext mongo,
        IIssueRepository issueRepository,
        IUserRepository userRepository,
        IRealtimeInteractionNotifier realtime)
    {
        _mongo = mongo;
        _issueRepository = issueRepository;
        _userRepository = userRepository;
        _realtime = realtime;
    }

    public async Task<PostLikeSummaryDto> GetLikeSummaryAsync(int postId, int? currentUserId, CancellationToken cancellationToken = default)
    {
        await EnsureIssueExistsAsync(postId, cancellationToken);

        var filter = Builders<PostLikeDocument>.Filter.Eq(x => x.PostId, postId);
        var count = await _mongo.PostLikes.CountDocumentsAsync(filter, cancellationToken: cancellationToken);

        bool liked = false;
        if (currentUserId.HasValue)
        {
            var userFilter = Builders<PostLikeDocument>.Filter.Eq(x => x.PostId, postId)
                & Builders<PostLikeDocument>.Filter.Eq(x => x.UserId, currentUserId.Value);
            liked = await _mongo.PostLikes.CountDocumentsAsync(
                userFilter,
                new CountOptions { Limit = 1 },
                cancellationToken: cancellationToken) > 0;
        }

        return new PostLikeSummaryDto
        {
            PostId = postId,
            LikeCount = (int)count,
            LikedByCurrentUser = liked
        };
    }

    public async Task<ToggleLikeResultDto> ToggleLikeAsync(int postId, int userId, CancellationToken cancellationToken = default)
    {
        await EnsureIssueExistsAsync(postId, cancellationToken);

        var userFilter = Builders<PostLikeDocument>.Filter.Eq(x => x.PostId, postId)
            & Builders<PostLikeDocument>.Filter.Eq(x => x.UserId, userId);

        var existing = await _mongo.PostLikes.Find(userFilter).FirstOrDefaultAsync(cancellationToken);

        if (existing is not null)
        {
            await _mongo.PostLikes.DeleteOneAsync(
                Builders<PostLikeDocument>.Filter.Eq(x => x.Id, existing.Id),
                cancellationToken);
        }
        else
        {
            var doc = new PostLikeDocument
            {
                Id = MongoDB.Bson.ObjectId.GenerateNewId(),
                PostId = postId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId
            };
            await _mongo.PostLikes.InsertOneAsync(doc, cancellationToken: cancellationToken);
        }

        var summary = await GetLikeSummaryAsync(postId, userId, cancellationToken);

        await _realtime.NotifyLikeUpdatedAsync(
            postId,
            summary.LikeCount,
            userId,
            summary.LikedByCurrentUser,
            cancellationToken);

        return new ToggleLikeResultDto
        {
            PostId = postId,
            LikeCount = summary.LikeCount,
            LikedByCurrentUser = summary.LikedByCurrentUser
        };
    }

    public async Task<IReadOnlyList<PostCommentDto>> GetCommentsAsync(int postId, CancellationToken cancellationToken = default)
    {
        await EnsureIssueExistsAsync(postId, cancellationToken);

        var filter = Builders<PostCommentDocument>.Filter.Eq(x => x.PostId, postId);
        var list = await _mongo.PostComments
            .Find(filter)
            .SortBy(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return await MapCommentsWithAuthorsAsync(list, cancellationToken);
    }

    public async Task<PostCommentDto> AddCommentAsync(int postId, int userId, CreatePostCommentDto dto, CancellationToken cancellationToken = default)
    {
        await EnsureIssueExistsAsync(postId, cancellationToken);

        var text = dto.Content?.Trim() ?? string.Empty;
        if (string.IsNullOrEmpty(text))
            throw new ArgumentException("Komenti nuk mund të jetë bosh.");

        if (text.Length > 2000)
            throw new ArgumentException("Komenti është shumë i gjatë.");

        var doc = new PostCommentDocument
        {
            Id = MongoDB.Bson.ObjectId.GenerateNewId(),
            PostId = postId,
            UserId = userId,
            Content = text,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = userId
        };

        await _mongo.PostComments.InsertOneAsync(doc, cancellationToken: cancellationToken);

        var user = await _userRepository.GetUserByIdAsync(userId);
        var author = user is null
            ? "Përdorues"
            : $"{user.FirstName} {user.LastName}".Trim();

        var result = new PostCommentDto
        {
            Id = doc.Id.ToString(),
            PostId = postId,
            UserId = userId,
            AuthorName = author,
            Content = doc.Content,
            CreatedAt = doc.CreatedAt
        };

        await _realtime.NotifyCommentAddedAsync(postId, result, cancellationToken);

        return result;
    }

    private async Task EnsureIssueExistsAsync(int postId, CancellationToken cancellationToken)
    {
        var issue = await _issueRepository.GetIssueByIdAsync(postId);
        if (issue is null)
            throw new KeyNotFoundException("Postimi nuk u gjet.");
    }

    private async Task<IReadOnlyList<PostCommentDto>> MapCommentsWithAuthorsAsync(
        IReadOnlyList<PostCommentDocument> list,
        CancellationToken cancellationToken)
    {
        if (list.Count == 0)
            return Array.Empty<PostCommentDto>();

        var userIds = list.Select(x => x.UserId).Distinct().ToList();
        var users = new Dictionary<int, string>();
        foreach (var uid in userIds)
        {
            var u = await _userRepository.GetUserByIdAsync(uid);
            users[uid] = u is null ? "Përdorues" : $"{u.FirstName} {u.LastName}".Trim();
        }

        return list.Select(c => new PostCommentDto
        {
            Id = c.Id.ToString(),
            PostId = c.PostId,
            UserId = c.UserId,
            AuthorName = users.GetValueOrDefault(c.UserId, "Përdorues"),
            Content = c.Content,
            CreatedAt = c.CreatedAt
        }).ToList();
    }
}
