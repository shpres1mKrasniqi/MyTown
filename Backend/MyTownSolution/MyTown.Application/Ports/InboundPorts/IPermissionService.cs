using System.Security.Claims;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IPermissionService
    {
        
        Task<bool> UserHasPermission(ClaimsPrincipal user, string permissionName);
    }
}