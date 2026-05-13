

using Microsoft.EntityFrameworkCore;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.Repositories
{
    public class FileRepository : IFileRepository
    {
        private readonly MyTownDbContext _context;
        public FileRepository(MyTownDbContext context)
        {
            _context = context;
        }
        public async Task AddFileAsync(MyTownFile file)
        {
            await _context.Files.AddAsync(file);

        }

        public async Task<IEnumerable<MyTownFile>> ReadFilesAsync()
        {
            return await _context.Files.Where(f => !f.IsDeleted).ToArrayAsync();
              
        }

        public void DeleteFile(MyTownFile file)
        {
            _context.Files.Update(file);
        }
    }
}
