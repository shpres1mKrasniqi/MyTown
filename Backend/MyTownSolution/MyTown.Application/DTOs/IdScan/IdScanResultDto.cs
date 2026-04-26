

namespace MyTown.Application.DTOs.IdScan
{
    public class IdScanResultDto
    {
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public string? DateOfBirth { get; init; }
        public string? PersonalNumber { get; init; }
        public string? Nationality { get; init; }
        public string? PlaceOfBirth { get; init; }


        public List<string> MissingFields { get; init; } = new();
        public bool RequiresManualCompletion => MissingFields.Any();
    }
}
