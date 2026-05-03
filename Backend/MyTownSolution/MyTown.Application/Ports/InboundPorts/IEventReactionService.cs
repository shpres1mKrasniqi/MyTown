using MyTown.Application.DTOs.Events;
using MyTown.Domain.Enums;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IEventReactionService
    {
        Task<EventReactionSummaryDto> GetReactionsAsync(int eventId, int? userId, CancellationToken cancellationToken = default);
        Task<ToggleReactionResultDto> ToggleReactionAsync(int eventId, int userId, EventReactionType reactionType, CancellationToken cancellationToken = default);
    }
}