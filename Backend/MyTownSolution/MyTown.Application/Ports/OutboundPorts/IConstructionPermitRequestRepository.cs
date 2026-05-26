using MyTown.Domain;

namespace MyTown.Application
{
    public interface IConstructionPermitRequestRepository
    {
        Task AddConstructionPermitRequestAsync(ConstructionPermitRequest constructionPermitRequest);

        Task<ConstructionPermitRequest> GetConstructionPermitRequestById(int id);

        Task<IEnumerable<ConstructionPermitRequest>> GetAllConstructionPermitRequests();

        Task UpdateAsync(ConstructionPermitRequest constructionPermitRequest);

        Task SoftDeleteAsync(ConstructionPermitRequest constructionPermitRequest);
    }
}