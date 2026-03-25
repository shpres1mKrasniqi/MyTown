

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
        public DbSet<Department> Departments { get; set; }
        public DbSet<Permission> Permissions { get; set; }  
        public DbSet<RolePermission> RolePermissions { get; set; }

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

            //  Konfigurimi i lidhjes Role -> RolePermissions (Nje me Shume)
            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions) 
                .HasForeignKey(rp => rp.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Konfigurimi i lidhjes Permission -> RolePermissions (Nje me Shume)
            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions) 
                .HasForeignKey(rp => rp.PermissionId)
                .OnDelete(DeleteBehavior.Cascade);

           
            // Nje rol nuk mund ta ketë të njëjtën leje dy herë
            modelBuilder.Entity<RolePermission>()
                .HasIndex(rp => new { rp.RoleId, rp.PermissionId })
                .IsUnique();
        }
    }
}
