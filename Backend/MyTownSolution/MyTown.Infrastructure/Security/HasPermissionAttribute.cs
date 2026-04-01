
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MyTown.Application.Ports.InboundPorts;

namespace MyTown.Infrastructure.Security
{
    public class HasPermissionAttribute : TypeFilterAttribute  
    {
        public HasPermissionAttribute(string permission) : base(typeof(PermissionFilter))
        {
            Arguments = new object[] { permission };
        }
    }

    public class PermissionFilter : IAsyncAuthorizationFilter
    {
        private readonly string _permission;
        private readonly IPermissionService _permissionService;

        public PermissionFilter(string permission, IPermissionService permissionService)
        {
            _permission = permission;
            _permissionService = permissionService;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var hasPermission = await _permissionService.UserHasPermission(user, _permission);
            if (!hasPermission)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}