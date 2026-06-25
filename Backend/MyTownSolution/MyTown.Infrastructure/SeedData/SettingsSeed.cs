using Microsoft.EntityFrameworkCore;
using MyTown.Domain.Entities;
using MyTown.Infrastructure.Persistence.Data;

namespace MyTown.Infrastructure.SeedData
{
    public static class SettingsSeed
    {
        public static async Task SeedSettingsAsync(MyTownDbContext context)
        {
            var settingsToSeed = new List<Setting>
            {
                new Setting
                {
                    Key = "LOGIN_MAX_FAILED_ATTEMPTS",
                    Value = "5",
                    Description = "Maximum allowed failed login attempts before temporary lockout"
                },
                new Setting
                {
                    Key = "LOGIN_LOCKOUT_MINUTES",
                    Value = "3",
                    Description = "Number of minutes the account remains locked after exceeding failed login attempts"
                }
            };

            foreach (var setting in settingsToSeed)
            {
                if (!await context.Settings.AnyAsync(s => s.Key == setting.Key))
                {
                    await context.Settings.AddAsync(setting);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
