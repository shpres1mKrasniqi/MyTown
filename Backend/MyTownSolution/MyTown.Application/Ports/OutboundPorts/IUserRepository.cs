using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IUserRepository
    {
        Task CreateUserAsync(User user);

        Task<User?> GetUserByIdAsync(int userId);

       Task<User?> GetByEmailAsync(string email);

        Task<bool> ExistsByEmailAsync(string email);

        Task AssignRoleAsync(User user, int roleId);

        Task UpdateUserAsync(User user);
    }
}
