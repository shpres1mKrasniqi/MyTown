using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Domain.Common
{
    public abstract class BaseEntity 
    {
        public int Id { get; protected set; }
        public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; protected set; }
        public string? CreatedBy { get; protected set; }
        public string? UpdatedBy { get; protected set; }

        

        public void SetCreated (string userId)
        {
            CreatedAt = DateTime.UtcNow;
            CreatedBy = userId;
        }
        public void setUpdated (string userId)
        {
            UpdatedAt = DateTime.UtcNow;
            UpdatedBy = userId;
        }
    }
}
