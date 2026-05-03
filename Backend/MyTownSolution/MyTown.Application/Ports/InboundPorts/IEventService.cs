using MyTown.Application.DTOs.Event;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IEventService
    {
        Task<EventResponseDto> CreateEventAsync(CreateEventDto createEventDto, int staffId,int userId, string ipAddress);
        Task PublishEventAsync (int id, int userId, string ipAddress);
        Task<IEnumerable<EventResponseDto>> GetAllEventsAsync(int? citizenId = null);
        Task<EventResponseDto?> GetEventByIdAsync(int id, int? citizenId = null);
        Task UpdateAsync(int id, UpdateEventDto dto, int userId, string ipAddress);
        Task DeleteAsync(int id, int userId, string ipAddress);


        Task<EventResponseDto> VoteAsync(int eventId, int citizenId,int userId, string ipAddress);
        Task<EventResponseDto> GetWinnerAsync(int komunaId);


    }
}
