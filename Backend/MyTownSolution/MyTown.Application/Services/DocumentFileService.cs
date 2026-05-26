using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace MyTown.Application
{
    public class DocumentFileService : IDocumentFileService
    {
        private readonly string _basePath;

        private static readonly HashSet<string> _allowedExtensions = new()
        {
            ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"
        };

        private static readonly HashSet<string> _allowedMimeTypes = new()
        {
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };

        public DocumentFileService(IConfiguration config)
        {
            _basePath = config["FileStorage:BasePath"] ?? "uploads";
        }

        public async Task<(string filePath, string fileName, long fileSize)> SaveFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Fajlli eshte bosh.");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!_allowedExtensions.Contains(extension))
                throw new ArgumentException($"Formati '{extension}' nuk lejohet. Lejohen: {string.Join(", ", _allowedExtensions)}");

            if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
                throw new ArgumentException($"Tipi '{file.ContentType}' nuk lejohet.");

            var folderPath = Path.Combine(_basePath, "construction-permits");
            Directory.CreateDirectory(folderPath);

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(folderPath, uniqueFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return (fullPath, file.FileName, file.Length);
        }
    }
}