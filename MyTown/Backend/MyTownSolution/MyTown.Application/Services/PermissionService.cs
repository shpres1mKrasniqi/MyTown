using MyTown.Application.Ports.InboundPorts;

using System.Security.Claims;


namespace MyTown.Application.Services
{
    public class PermissionService : IPermissionService
    {

        public Task<bool> UserHasPermission(ClaimsPrincipal user, string permissionName)
        {

            var hasPermission = user.Claims
                .Any(c => c.Type == "Permission" && c.Value == permissionName);

            return Task.FromResult(hasPermission);
        }
    }
}