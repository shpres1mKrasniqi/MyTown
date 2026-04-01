namespace MyTown.Domain.Common
{
    public class AuditLog
    {
        public int Id { get; private set; }

        public int UserId { get; private set; }

        public string Action { get; private set; } = null!;

        public string Entity { get; private set; } = null!;

        public int EntityId { get; private set; }

        public string? OldValue { get; private set; }

        public string? NewValue { get; private set; }

        public string IpAddress { get; private set; } = null!;

        public DateTime Created { get; private set; }

        protected AuditLog() { }

        public AuditLog(int userId, string action, string entity,
            int entityId, string? oldValue, string? newValue, string ipAddress)
        {
            UserId = userId;
            Action = action;
            Entity = entity;
            EntityId = entityId;
            OldValue = oldValue;
            NewValue = newValue;
            IpAddress = ipAddress;
            Created = DateTime.UtcNow;
        }
    }
}