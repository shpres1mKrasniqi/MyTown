using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IRoleRepository
    {
        Task<Role?> GetRoleByIdAsync(int roleId);
        Task<bool> ExistsAsync(int roleId);
        Task<Role?> GetRoleByNameAsync(string roleName);
    }
}
