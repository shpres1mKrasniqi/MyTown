namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IPermissionRepository
    {
   
        Task<bool> RoleHasPermissionAsync(string roleName, string permissionName);
    }
}