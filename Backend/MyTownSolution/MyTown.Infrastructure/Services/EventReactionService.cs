using MongoDB.Driver;
using MyTown.Application.DTOs.Events;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Domain.Enums;
using MyTown.Infrastructure.Persistence.Mongo;
using MyTown.Infrastructure.Persistence.Mongo.Documents;

namespace MyTown.Application.Services
{
    public class EventReactionService : IEventReactionService
    {
        private readonly MongoDbContext _mongo;

        public EventReactionService(MongoDbContext mongo)
        {
            _mongo = mongo;
        }

        public async Task<EventReactionSummaryDto> GetReactionsAsync(int eventId, int? userId, CancellationToken cancellationToken = default)
        {
            var reactions = await _mongo.EventReactions
                .Find(r => r.EventId == eventId)
                .ToListAsync(cancellationToken);

            var counts = reactions
                .GroupBy(r => r.ReactionType)
                .ToDictionary(g => g.Key.ToString(), g => g.Count());

            var myReaction = userId.HasValue
                ? reactions.FirstOrDefault(r => r.UserId == userId.Value)?.ReactionType
                : null;

            return new EventReactionSummaryDto
            {
                EventId = eventId,
                TotalReactions = reactions.Count,
                MyReaction = myReaction,
                ReactionCounts = counts
            };
        }

        public async Task<ToggleReactionResultDto> ToggleReactionAsync(int eventId, int userId, EventReactionType reactionType, CancellationToken cancellationToken = default)
        {
            var existing = await _mongo.EventReactions
                .Find(r => r.EventId == eventId && r.UserId == userId)
                .FirstOrDefaultAsync(cancellationToken);

            
            if (existing != null && existing.ReactionType == reactionType)
            {
                await _mongo.EventReactions.DeleteOneAsync(
                    r => r.EventId == eventId && r.UserId == userId,
                    cancellationToken);

                var summary = await GetReactionsAsync(eventId, userId, cancellationToken);
                return new ToggleReactionResultDto { Reacted = false, ReactionType = null, Summary = summary };
            }

           
            if (existing != null)
            {
                var update = Builders<EventReactionDocument>.Update
                    .Set(r => r.ReactionType, reactionType);
                await _mongo.EventReactions.UpdateOneAsync(
                    r => r.EventId == eventId && r.UserId == userId,
                    update, cancellationToken: cancellationToken);
            }
            else
            {
                
                await _mongo.EventReactions.InsertOneAsync(new EventReactionDocument
                {
                    EventId = eventId,
                    UserId = userId,
                    ReactionType = reactionType,
                    CreatedAt = DateTime.UtcNow
                }, cancellationToken: cancellationToken);
            }

            var updatedSummary = await GetReactionsAsync(eventId, userId, cancellationToken);
            return new ToggleReactionResultDto { Reacted = true, ReactionType = reactionType, Summary = updatedSummary };
        }
    }
}