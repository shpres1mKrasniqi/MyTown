using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyTown.API.Hubs.Problems;
using MyTown.API.Hubs.Proposals;
using MyTown.API.Hubs.Votat;
using MyTown.API.Services;
using MyTown.Application.Authorization;
using MyTown.Application.DTOs.ProjectProposals;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Application.Services;
using MyTown.Application.Settings;
using MyTown.Application.Validators;
using MyTown.Infrastructure.Hubs;
using MyTown.Infrastructure.Persistence.Data;
using MyTown.Infrastructure.Persistence.Mongo;
using MyTown.Infrastructure.Repositories;
using MyTown.Infrastructure.SeedData;
using MyTown.Infrastructure.Services;
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


//Databaza e Mongos:
builder.Services.Configure<MongoSettings>(options =>
{
    options.ConnectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING");
    options.Database = Environment.GetEnvironmentVariable("MONGO_DATABASE");
});

// JwtSetingsat
var jwtSettings = new JwtSettings
{
    SecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? throw new Exception("JWT_SECRET_KEY nuk u gjet"),
    Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new Exception("JWT_ISSUER nuk u gjet"),
    Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new Exception("JWT_AUDIENCE nuk u gjet"),
    AccessTokenExpirationMinutes = int.Parse(Environment.GetEnvironmentVariable("JWT_ACCESS_TOKEN_MINUTES") ?? throw new Exception("JWT_ACCESS_TOKEN_MINUTES nuk u gjet")),
    RefreshTokenExpirationDays = int.Parse(Environment.GetEnvironmentVariable("JWT_REFRESH_TOKEN_DAYS") ?? throw new Exception("JWT_REFRESH_TOKEN_DAYS nuk u gjet"))
};

builder.Services.Configure<JwtSettings>(options =>
{
    options.SecretKey = jwtSettings.SecretKey;
    options.Issuer = jwtSettings.Issuer;
    options.Audience = jwtSettings.Audience;
    options.AccessTokenExpirationMinutes = jwtSettings.AccessTokenExpirationMinutes;
    options.RefreshTokenExpirationDays = jwtSettings.RefreshTokenExpirationDays;
});

//Qelsi i Tokenit:

var qelsiSekreti = Environment.GetEnvironmentVariable("REFRESH_TOKEN_SECRET_KEY");


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
//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)  // allow any origin in dev
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
builder.Services.AddScoped<IKomunaRepository, KomunaRepository>();
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<IAuditRepository, AuditRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICitizenRepository, CitizenRepository>();
builder.Services.AddScoped<IIssueCategoryRepository, IssueCategoryRepository>();
builder.Services.AddScoped<IIssueRepository, IssueRepository>();
builder.Services.AddScoped<IFileRepository, FileRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IProjectProposalRepository, ProjectProposalRepository>();
// Servicet
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IKomunaService, KomunaService>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<ICitizenService, CitizenService>();
builder.Services.AddScoped<IIssueCategoryService, IssueCategoryService>();
builder.Services.AddScoped<IIssueService, IssueService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IPostInteractionService, PostInteractionService>();
builder.Services.AddScoped<IRealtimeInteractionNotifier, RealtimeInteractionNotifier>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IEventReactionService, EventReactionService>();
builder.Services.AddScoped<IProjectProposalService, ProjectProposalService>();
builder.Services.AddScoped<IProposalVotes, ProposalVotesService>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateProposalValidator>();

var emailSettings = new EmailSettings
{
    SmtpHost = Environment.GetEnvironmentVariable("EMAIL_SMTP_HOST") ?? "smtp.gmail.com",
    SmtpPort = int.Parse(Environment.GetEnvironmentVariable("EMAIL_SMTP_PORT") ?? "587"),
    SenderEmail = Environment.GetEnvironmentVariable("EMAIL_SENDER") ?? throw new Exception("EMAIL_SENDER nuk u gjet"),
    SenderName = Environment.GetEnvironmentVariable("EMAIL_SENDER_NAME") ?? "MyTown",
    AppPassword = Environment.GetEnvironmentVariable("EMAIL_APP_PASSWORD") ?? throw new Exception("EMAIL_APP_PASSWORD nuk u gjet"),
    ResetCodeExpirationMinutes = int.Parse(Environment.GetEnvironmentVariable("EMAIL_RESET_CODE_EXPIRATION_MINUTES") ?? "15")
};

builder.Services.Configure<EmailSettings>(options =>
{
    options.SmtpHost = emailSettings.SmtpHost;
    options.SmtpPort = emailSettings.SmtpPort;
    options.SenderEmail = emailSettings.SenderEmail;
    options.SenderName = emailSettings.SenderName;
    options.AppPassword = emailSettings.AppPassword;
    options.ResetCodeExpirationMinutes = emailSettings.ResetCodeExpirationMinutes;
});



builder.Services.AddSingleton(sp =>
{
    var endpoint = Environment.GetEnvironmentVariable("AZURE_DOC_ENDPOINT");
    var key = Environment.GetEnvironmentVariable("AZURE_DOC_KEY");

    return new DocumentAnalysisClient(
        new Uri(endpoint),
        new AzureKeyCredential(key));
});

builder.Services.AddScoped<IIdScanService, AzureIdScanService>();

//DI per mongo:
builder.Services.AddSingleton<MongoDbContext>();

//SignalR:

builder.Services.AddSignalR();
builder.Services.AddScoped<INotificationSender, SignalRNotificationSender>();

builder.Services.AddAuthorization(options =>
{
    var permissions = new[]
 {
    Permissions.CanCreateDepartment,
    Permissions.CanUpdateDepartment,
    Permissions.CanDeleteDepartment,
    Permissions.CanViewDepartments,

    Permissions.CanCreateStaff,
    Permissions.CanEditStaff,
    Permissions.CanDeleteStaff,
    Permissions.CanViewStaff,

    Permissions.CanCreateCitizen,
    Permissions.CanEditCitizen,
    Permissions.CanDeleteCitizen,
    Permissions.CanViewCitizen,

    Permissions.CanCreateKomuna,
    Permissions.CanEditKomuna,
    Permissions.CanDeleteKomuna,
    Permissions.CanViewKomuna,

    Permissions.CanCreateIssueCategory,
    Permissions.CanEditIssueCategory,
    Permissions.CanDeleteIssueCategory,
    Permissions.CanViewIssueCategory,

    Permissions.CanCreateEvent,
    Permissions.CanEditEvent,
    Permissions.CanDeleteEvent,
    Permissions.CanViewEvent,

    Permissions.CanCreateIssue,
    Permissions.CanEditIssue,
    Permissions.CanDeleteIssue,
    Permissions.CanViewIssue,

    Permissions.CanDeleteProjectProposal,
    Permissions.CanCreateProjectProposal,
    Permissions.CanEditProjectProposal,
    Permissions.CanViewProjectProposal,

    Permissions.CanVote
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

//Kontrollojna a u lidh mongo apo jo:
using (var scope = app.Services.CreateScope())
{
    try
    {
        var mongoContext = scope.ServiceProvider.GetRequiredService<MongoDbContext>();

        var command = new MongoDB.Bson.BsonDocument("ping", 1);
        await mongoContext.Database.RunCommandAsync<MongoDB.Bson.BsonDocument>(command);
        await mongoContext.EnsureIndexesAsync();

        Console.WriteLine(" MongoDB u lidh me sukses!");
    }
    catch (Exception ex)
    {
        Console.WriteLine(" MongoDB nuk u lidh:");
        Console.WriteLine(ex.Message);
    }
}

// --- HTTP PIPELINE ---
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapHub<EventHub>("/hubs/events");
app.MapHub<ProblemHub>("/hubs/problems");
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapHub<VotatHub>("/hubs/votat");
app.MapHub<ProposalsHub>("/hubs/proposals");
app.UseStaticFiles();
app.MapControllers();


app.Run();
