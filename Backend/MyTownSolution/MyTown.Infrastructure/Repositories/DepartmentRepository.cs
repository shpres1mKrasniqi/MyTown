using MyTown.Application.Ports.OutboundPorts;
using MyTown.Infrastructure.Persistence.Data;
using MyTown.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MyTown.Infrastructure.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly MyTownDbContext _context;

        public DepartmentRepository(MyTownDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Department department)
        {
            await _context.Departments.AddAsync(department);
        }
        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            return await _context.Departments
                .Include(d => d.Komuna)
                .Where(d => d.IsActive).ToListAsync();
        }
        public async Task<Department> GetByIdAsync(int id)
        {
            return await _context.Departments
                 .Include(d => d.Komuna)
                .FirstOrDefaultAsync(d => d.Id == id && d.IsActive);
        }
        public async Task<bool> ExistsByNameAsync(string name, int komunaId)
        {
            return await _context.Departments.AnyAsync(d => d.Name == name && d.IsActive && d.KomunaId == komunaId);
        }
        public async Task UpdateAsync(Department department)
        {
            _context.Departments.Update(department);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public IQueryable<Department> Query()
        {
            return _context.Departments
                .Include(d => d.Komuna)
                .Where(d => d.IsActive == true)
                .AsQueryable();
        }
    }
}
