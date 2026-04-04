using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyTown.Application.Authorization;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Application.Services;
using MyTown.Application.Settings;
using MyTown.Application.Validators;
using MyTown.Infrastructure.Persistence.Data;
using MyTown.Infrastructure.Repositories;
using MyTown.Infrastructure.SeedData;
using System.Security.Claims;
using System.Text;


DotNetEnv.Env.Load(".env");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateDepartmentValidator>();
builder.Services.AddOpenApi();

// Databaza
var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
if (string.IsNullOrEmpty(connectionString))
    throw new Exception("CONNECTION_STRING nuk u gjet në .env");

builder.Services.AddDbContext<MyTownDbContext>(options =>
    options.UseSqlServer(connectionString));

// JwtSetingsat
var jwtSettings = new JwtSettings
{
    SecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? throw new Exception("JWT_SECRET_KEY nuk u gjet"),
    Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new Exception("JWT_ISSUER nuk u gjet"),
    Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new Exception("JWT_AUDIENCE nuk u gjet"),
    AccessTokenExpirationMinutes = int.Parse(Environment.GetEnvironmentVariable("JWT_ACCESS_TOKEN_MINUTES") ?? "15"),
    RefreshTokenExpirationDays = int.Parse(Environment.GetEnvironmentVariable("JWT_REFRESH_TOKEN_DAYS") ?? "7")
};

builder.Services.Configure<JwtSettings>(options =>
{
    options.SecretKey = jwtSettings.SecretKey;
    options.Issuer = jwtSettings.Issuer;
    options.Audience = jwtSettings.Audience;
    options.AccessTokenExpirationMinutes = jwtSettings.AccessTokenExpirationMinutes;
    options.RefreshTokenExpirationDays = jwtSettings.RefreshTokenExpirationDays;
});

// Pjesa e Authit
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = ClaimTypes.NameIdentifier
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("accessToken"))
            {
                context.Token = context.Request.Cookies["accessToken"];
            }
            return Task.CompletedTask;
        }
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Repot
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IKomunaRepository, KomunaRepository>();
builder.Services.AddScoped<IKomunaService, KomunaService>();
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<IAuditRepository, AuditRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICitizenRepository, CitizenRepository>();

// Servicet
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IStaffServices, StaffService>();
builder.Services.AddScoped<ICitizenService, CitizenService>();

//Permissions te shtuara
builder.Services.AddAuthorization(options =>
{
    var permissions = new[]
 {
    Permissions.CanCreateDepartment,
    Permissions.CanViewDepartments,
    Permissions.CanUpdateDepartment,
    Permissions.CanDeleteDepartment,

    Permissions.CanCreateKomuna,
    Permissions.CanViewKomuna,
    Permissions.CanUpdateKomuna,
    Permissions.CanDeleteKomuna,

    Permissions.CanCreateStaff,
    Permissions.CanViewStaff,
    Permissions.CanUpdateStaff,
    Permissions.CanDeleteStaff,

    Permissions.CanCreateCitizen,
    Permissions.CanViewCitizen,
    Permissions.CanUpdateCitizen,
    Permissions.CanDeleteCitizen
};
    foreach (var premission in permissions)
    {
        options.AddPolicy(premission, policy => policy.RequireClaim(CustomClaimTypes.Permission, premission));
    }

});

var app = builder.Build();
//Pjesa e Seed Data
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<MyTownDbContext>();

    await RoleSeed.SeedRoleAsync(dbContext);
    await PermissionSeed.SeedPermissionsAsync(dbContext);
    await AdminSeed.SeedAdminAsync(dbContext);
}

// --- HTTP PIPELINE ---
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
