using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyTown.Domain.Entities;

namespace MyTown.Infrastructure.Persistence.Configurations
{
    public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
    {
        public void Configure(EntityTypeBuilder<Department> builder)
        {
            builder.HasOne(d => d.Komuna)
                .WithMany(k => k.Departments)
                .HasForeignKey(d => d.KomunaId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
