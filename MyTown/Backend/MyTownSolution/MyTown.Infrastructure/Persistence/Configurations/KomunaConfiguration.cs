using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyTown.Domain.Entities;

namespace MyTown.Infrastructure.Persistence.Configurations
{
    public class KomunaConfiguration : IEntityTypeConfiguration<Komuna>
    {
        public void Configure(EntityTypeBuilder<Komuna> builder)
        {
            builder.Property(k => k.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(k => k.Description)
                .HasMaxLength(1000);

            builder.HasIndex(k => k.Name)
                .IsUnique()
                .HasFilter("[IsDeleted] = 0");
        }
    }
}
