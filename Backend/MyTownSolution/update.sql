IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Action] nvarchar(max) NOT NULL,
        [Entity] nvarchar(max) NOT NULL,
        [EntityId] int NOT NULL,
        [OldValue] nvarchar(max) NULL,
        [NewValue] nvarchar(max) NULL,
        [IpAddress] nvarchar(max) NOT NULL,
        [Created] datetime2 NOT NULL,
        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [IssueCategories] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_IssueCategories] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Komunas] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(200) NOT NULL,
        [Description] nvarchar(1000) NULL,
        [IsDeleted] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_Komunas] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Notifications] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Message] nvarchar(max) NOT NULL,
        [IsRead] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Permissions] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Permissions] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Roles] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Roles] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Settings] (
        [Id] int NOT NULL IDENTITY,
        [Key] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Settings] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [FirstName] nvarchar(max) NOT NULL,
        [LastName] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [PasswordHash] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Departments] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [KomunaId] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_Departments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Departments_Komunas_KomunaId] FOREIGN KEY ([KomunaId]) REFERENCES [Komunas] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [ProjectProposals] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Budget] decimal(18,2) NOT NULL,
        [PlannedStartDate] datetime2 NULL,
        [PlannedEndDate] datetime2 NULL,
        [TenderWinnerCompany] nvarchar(max) NULL,
        [VotingDeadline] datetime2 NOT NULL,
        [Status] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [KomunaId] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_ProjectProposals] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProjectProposals_Komunas_KomunaId] FOREIGN KEY ([KomunaId]) REFERENCES [Komunas] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [RolePermissions] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] int NOT NULL,
        [PermissionId] int NOT NULL,
        CONSTRAINT [PK_RolePermissions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RolePermissions_Permissions_PermissionId] FOREIGN KEY ([PermissionId]) REFERENCES [Permissions] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_RolePermissions_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [CitizenProfiles] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [KomunaId] int NOT NULL,
        [PhoneNumber] nvarchar(max) NOT NULL,
        [Address] nvarchar(max) NOT NULL,
        [PersonalNumber] nvarchar(450) NOT NULL,
        [DateOfBirth] datetime2 NOT NULL,
        [Nationality] nvarchar(max) NULL,
        [PlaceOfBirth] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_CitizenProfiles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_CitizenProfiles_Komunas_KomunaId] FOREIGN KEY ([KomunaId]) REFERENCES [Komunas] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_CitizenProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [PasswordResetTokens] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [CodeHash] nvarchar(max) NOT NULL,
        [ExpiresAt] datetime2 NOT NULL,
        [IsUsed] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_PasswordResetTokens] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PasswordResetTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [RefreshTokens] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [TokenHash] nvarchar(max) NOT NULL,
        [ExpiresAt] datetime2 NOT NULL,
        [RevokedAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_RefreshTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [UserLockouts] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [FailedAttempts] int NOT NULL,
        [LockoutEnd] datetime2 NULL,
        [LastFailedAttemptAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_UserLockouts] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UserLockouts_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [UserRoles] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [RoleId] int NOT NULL,
        [AssignedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_UserRoles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UserRoles_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Roles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_UserRoles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [StaffProfiles] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [DepartmentId] int NOT NULL,
        [Position] nvarchar(max) NOT NULL,
        [DateHired] datetime2 NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_StaffProfiles] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StaffProfiles_Departments_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Departments] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_StaffProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Issues] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [CitizenId] int NOT NULL,
        [KomunaId] int NOT NULL,
        [Status] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [IssueCategoryId] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_Issues] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Issues_CitizenProfiles_CitizenId] FOREIGN KEY ([CitizenId]) REFERENCES [CitizenProfiles] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Issues_IssueCategories_IssueCategoryId] FOREIGN KEY ([IssueCategoryId]) REFERENCES [IssueCategories] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Issues_Komunas_KomunaId] FOREIGN KEY ([KomunaId]) REFERENCES [Komunas] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Events] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [EventDate] datetime2 NOT NULL,
        [Location] nvarchar(max) NOT NULL,
        [KomunaId] int NOT NULL,
        [StaffId] int NOT NULL,
        [Status] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_Events] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Events_Komunas_KomunaId] FOREIGN KEY ([KomunaId]) REFERENCES [Komunas] ([Id]),
        CONSTRAINT [FK_Events_StaffProfiles_StaffId] FOREIGN KEY ([StaffId]) REFERENCES [StaffProfiles] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [WorkSchedules] (
        [Id] int NOT NULL IDENTITY,
        [StaffId] int NOT NULL,
        [Date] datetime2 NOT NULL,
        [DayOfWeek] int NOT NULL,
        [ShiftStart] time NOT NULL,
        [ShiftEnd] time NOT NULL,
        [ShiftType] int NOT NULL,
        [Location] nvarchar(max) NOT NULL,
        [Notes] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_WorkSchedules] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_WorkSchedules_StaffProfiles_StaffId] FOREIGN KEY ([StaffId]) REFERENCES [StaffProfiles] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE TABLE [Files] (
        [Id] int NOT NULL IDENTITY,
        [Entity] nvarchar(max) NOT NULL,
        [EntityId] int NOT NULL,
        [FileName] nvarchar(max) NOT NULL,
        [FilePath] nvarchar(max) NOT NULL,
        [FileSize] bigint NOT NULL,
        [UploadedBy] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        [IssueId] int NULL,
        [EventId] int NULL,
        [ProjectProposalId] int NULL,
        CONSTRAINT [PK_Files] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Files_Events_EventId] FOREIGN KEY ([EventId]) REFERENCES [Events] ([Id]),
        CONSTRAINT [FK_Files_Issues_IssueId] FOREIGN KEY ([IssueId]) REFERENCES [Issues] ([Id]),
        CONSTRAINT [FK_Files_ProjectProposals_ProjectProposalId] FOREIGN KEY ([ProjectProposalId]) REFERENCES [ProjectProposals] ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_CitizenProfiles_KomunaId] ON [CitizenProfiles] ([KomunaId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_CitizenProfiles_PersonalNumber] ON [CitizenProfiles] ([PersonalNumber]) WHERE [IsDeleted] = 0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE UNIQUE INDEX [IX_CitizenProfiles_UserId] ON [CitizenProfiles] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Departments_KomunaId] ON [Departments] ([KomunaId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Events_KomunaId] ON [Events] ([KomunaId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Events_StaffId] ON [Events] ([StaffId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Files_EventId] ON [Files] ([EventId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Files_IssueId] ON [Files] ([IssueId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Files_ProjectProposalId] ON [Files] ([ProjectProposalId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Issues_CitizenId] ON [Issues] ([CitizenId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Issues_IssueCategoryId] ON [Issues] ([IssueCategoryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_Issues_KomunaId] ON [Issues] ([KomunaId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Komunas_Name] ON [Komunas] ([Name]) WHERE [IsDeleted] = 0');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_PasswordResetTokens_UserId] ON [PasswordResetTokens] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_ProjectProposals_KomunaId] ON [ProjectProposals] ([KomunaId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_RefreshTokens_UserId] ON [RefreshTokens] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_RolePermissions_PermissionId] ON [RolePermissions] ([PermissionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE UNIQUE INDEX [IX_RolePermissions_RoleId_PermissionId] ON [RolePermissions] ([RoleId], [PermissionId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Settings_Key] ON [Settings] ([Key]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_StaffProfiles_DepartmentId] ON [StaffProfiles] ([DepartmentId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StaffProfiles_UserId] ON [StaffProfiles] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE UNIQUE INDEX [IX_UserLockouts_UserId] ON [UserLockouts] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_UserRoles_RoleId] ON [UserRoles] ([RoleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE UNIQUE INDEX [IX_UserRoles_UserId_RoleId] ON [UserRoles] ([UserId], [RoleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    CREATE INDEX [IX_WorkSchedules_StaffId] ON [WorkSchedules] ([StaffId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260522091514_Settings'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260522091514_Settings', N'10.0.5');
END;

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260523183852_ImplementedMeetingRequests'
)
BEGIN
    CREATE TABLE [MeetingRequests] (
        [Id] int NOT NULL IDENTITY,
        [CitizenId] int NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Reason] nvarchar(max) NOT NULL,
        [Status] int NOT NULL,
        [DateOfMeeting] date NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_MeetingRequests] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_MeetingRequests_CitizenProfiles_CitizenId] FOREIGN KEY ([CitizenId]) REFERENCES [CitizenProfiles] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260523183852_ImplementedMeetingRequests'
)
BEGIN
    CREATE INDEX [IX_MeetingRequests_CitizenId] ON [MeetingRequests] ([CitizenId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260523183852_ImplementedMeetingRequests'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260523183852_ImplementedMeetingRequests', N'10.0.5');
END;

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260525091259_RregullimIDates'
)
BEGIN
    DECLARE @var nvarchar(max);
    SELECT @var = QUOTENAME([d].[name])
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[MeetingRequests]') AND [c].[name] = N'DateOfMeeting');
    IF @var IS NOT NULL EXEC(N'ALTER TABLE [MeetingRequests] DROP CONSTRAINT ' + @var + ';');
    ALTER TABLE [MeetingRequests] ALTER COLUMN [DateOfMeeting] datetime2 NOT NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260525091259_RregullimIDates'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260525091259_RregullimIDates', N'10.0.5');
END;

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260526112755_KerkesaPerNdertime'
)
BEGIN
    CREATE TABLE [ConstructionPermitRequests] (
        [Id] int NOT NULL IDENTITY,
        [CitizenId] int NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Status] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_ConstructionPermitRequests] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ConstructionPermitRequests_CitizenProfiles_CitizenId] FOREIGN KEY ([CitizenId]) REFERENCES [CitizenProfiles] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260526112755_KerkesaPerNdertime'
)
BEGIN
    CREATE TABLE [ConstructionDocuments] (
        [Id] int NOT NULL IDENTITY,
        [ConstructionPermitRequestId] int NOT NULL,
        [FilePath] nvarchar(max) NOT NULL,
        [FileName] nvarchar(max) NOT NULL,
        [FileSize] bigint NOT NULL,
        [Type] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] int NULL,
        [UpdatedBy] int NULL,
        CONSTRAINT [PK_ConstructionDocuments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ConstructionDocuments_ConstructionPermitRequests_ConstructionPermitRequestId] FOREIGN KEY ([ConstructionPermitRequestId]) REFERENCES [ConstructionPermitRequests] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260526112755_KerkesaPerNdertime'
)
BEGIN
    CREATE INDEX [IX_ConstructionDocuments_ConstructionPermitRequestId] ON [ConstructionDocuments] ([ConstructionPermitRequestId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260526112755_KerkesaPerNdertime'
)
BEGIN
    CREATE INDEX [IX_ConstructionPermitRequests_CitizenId] ON [ConstructionPermitRequests] ([CitizenId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260526112755_KerkesaPerNdertime'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260526112755_KerkesaPerNdertime', N'10.0.5');
END;

COMMIT;
GO

