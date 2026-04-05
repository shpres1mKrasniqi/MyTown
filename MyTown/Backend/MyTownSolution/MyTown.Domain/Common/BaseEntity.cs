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
        public int? CreatedBy { get; protected set; }
        public int? UpdatedBy { get; protected set; }

        

        public void SetCreated (int userId)
        {
            CreatedAt = DateTime.UtcNow;
            CreatedBy = userId;
        }
        public void SetUpdated (int userId)
        {
            UpdatedAt = DateTime.UtcNow;
            UpdatedBy = userId;
        }
    }
}
