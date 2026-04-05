namespace MyTown.Application.DTOs.Komuna
{
    public record KomunaResponse(
        int Id,
        string Name,
        string? Description,
        bool IsActive,
        bool IsDeleted,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        int? CreatedBy,
        int? UpdatedBy);
}
