namespace MyTown.Application
{
    public interface IConstructionPermitRequestService
    {
        Task AddConstructionPermitRequestAsync(CreateConstructionPermitRequestDto dto, int citizenId,int komunaId, string ipAddress);
        Task<IEnumerable<ConstructionPermitRequestResponseDto>> GetAllRequestsAsync();
        Task<ConstructionPermitRequestResponseDto> GetPermitReqById(int id);
        Task UpdatePermitRequestAsync(int id, UpdateConstructionPermitRequestDto dto, int staffId, string ipAddress);
        Task UpdateDocumentsAsync(int id, UpdateConstructionDocumentsDto dto, int staffId, string ipAddress);
        Task SoftDeleteRequest(int requestId, int citizenId, string ipAddress);
    }
}