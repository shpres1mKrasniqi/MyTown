using MyTown.Application.DTOs.Komuna;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;

namespace MyTown.Application.Services
{
    public class KomunaService : IKomunaService
    {
        private readonly IKomunaRepository _komunaRepository;

        public KomunaService(IKomunaRepository komunaRepository)
        {
            _komunaRepository = komunaRepository;
        }

        public async Task CreateAsync(CreateKomuna dto, int userId)
        {
            if (await _komunaRepository.ExistsByNameAsync(dto.Name, null))
            {
                throw new Exception($"Komuna me emrin '{dto.Name}' ekziston tashme.");
            }

            var komuna = new Komuna(dto.Name, dto.Description);
            komuna.SetCreated(userId);
            await _komunaRepository.AddAsync(komuna);
            await _komunaRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<KomunaResponse>> GetAllAsync()
        {
            var list = await _komunaRepository.GetAllActiveAsync();
            return list.Select(ToResponse);
        }

        public async Task<KomunaResponse> GetByIdAsync(int id)
        {
            var komuna = await _komunaRepository.GetActiveByIdAsync(id);
            if (komuna == null)
            {
                throw new Exception($"Komuna me id '{id}' nuk u gjet.");
            }

            return ToResponse(komuna);
        }

        public async Task UpdateAsync(int id, UpdateKomuna dto, int userId)
        {
            var komuna = await _komunaRepository.GetActiveByIdAsync(id);
            if (komuna == null)
            {
                throw new Exception($"Komuna me id '{id}' nuk u gjet.");
            }

            if (!string.Equals(komuna.Name, dto.Name, StringComparison.Ordinal)
                && await _komunaRepository.ExistsByNameAsync(dto.Name, id))
            {
                throw new Exception($"Komuna me emrin '{dto.Name}' ekziston tashme.");
            }

            komuna.Update(dto.Name, dto.Description);
            komuna.SetUpdated(userId);
            await _komunaRepository.UpdateAsync(komuna);
            await _komunaRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var komuna = await _komunaRepository.GetActiveByIdAsync(id);
            if (komuna == null)
            {
                throw new Exception($"Komuna me id '{id}' nuk u gjet.");
            }

            if (await _komunaRepository.HasActiveDepartmentsAsync(id))
            {
                throw new Exception("Nuk mund te fshihet komuna sepse ka departamente te lidhura.");
            }

            komuna.MarkDeleted(userId);
            await _komunaRepository.UpdateAsync(komuna);
            await _komunaRepository.SaveChangesAsync();
        }

        private static KomunaResponse ToResponse(Komuna k) =>
            new(
                k.Id,
                k.Name,
                k.Description,
                k.IsActive,
                k.IsDeleted,
                k.CreatedAt,
                k.UpdatedAt,
                k.CreatedBy,
                k.UpdatedBy);
    }
}
