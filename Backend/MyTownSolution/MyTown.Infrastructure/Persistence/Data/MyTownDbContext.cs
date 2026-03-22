

using Microsoft.EntityFrameworkCore;
using MyTown.Domain.Entities;

namespace MyTown.Infrastructure.Persistence.Data
{
    public class MyTownDbContext : DbContext
    {

        public MyTownDbContext(DbContextOptions<MyTownDbContext> options) : base(options) { }
        
        
       public DbSet<User> Users { get; set; }
        
        public DbSet<Role> Roles { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(MyTownDbContext).Assembly);

            modelBuilder.Entity<RefreshToken>()
               .HasOne(t => t.User)
               .WithMany(u => u.RefreshTokens)
               .HasForeignKey(t => t.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            
            modelBuilder.Entity<UserRole>()
                .HasIndex(ur => new { ur.UserId, ur.RoleId })
                .IsUnique(); 

            modelBuilder.Entity<UserRole>()
                .Property(ur => ur.Id)
                .ValueGeneratedOnAdd();

         
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);
        }
    }
}
