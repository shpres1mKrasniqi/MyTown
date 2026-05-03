using MyTown.Domain.Enums;

namespace MyTown.Application.DTOs.Events
{
    public class EventReactionSummaryDto
    {
        public int EventId { get; set; }
        public int TotalReactions { get; set; }
        public EventReactionType? MyReaction { get; set; } 
        public Dictionary<string, int> ReactionCounts { get; set; } = new();
        
    }

    public class ToggleReactionDto
    {
        public EventReactionType ReactionType { get; set; }
    }

    public class ToggleReactionResultDto
    {
        public bool Reacted { get; set; }
        public EventReactionType? ReactionType { get; set; }
        public EventReactionSummaryDto Summary { get; set; }
    }
}