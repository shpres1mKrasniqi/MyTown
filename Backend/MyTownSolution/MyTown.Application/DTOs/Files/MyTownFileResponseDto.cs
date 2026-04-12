namespace MyTown.Application.DTOs.Files
{
    public class MyTownFileResponseDto
    {
        public int Id { get; set; }

        public string Entity { get; set; }

        public int EntityId { get; set; }

        public string FileName { get; set; }

        public string FileUrl { get; set; } 

        public long FileSize { get; set; }

        public int UploadedBy { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}