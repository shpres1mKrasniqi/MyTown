using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using System.Security.Claims;

public class PermissionService : IPermissionService
{
    private readonly IPermissionRepository _permissionRepository;

    public PermissionService(IPermissionRepository permissionRepository)
    {
        _permissionRepository = permissionRepository;
    }

    public async Task<bool> UserHasPermission(ClaimsPrincipal user, string permissionName)
    {
        var userRole = user.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userRole)) return false;
        return await _permissionRepository.RoleHasPermissionAsync(userRole, permissionName);
    }
}