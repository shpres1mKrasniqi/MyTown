using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyTown.Domain.Entities;

namespace MyTown.Infrastructure.Persistence.Configurations
{
    public class CitizenProfileConfiguration : IEntityTypeConfiguration<CitizenProfile>
    {
        public void Configure(EntityTypeBuilder<CitizenProfile> builder)
        {
            builder.HasIndex(c => c.PersonalNumber)
                   .IsUnique()
                   .HasFilter("[IsDeleted] = 0"); 
        }
    }
}
