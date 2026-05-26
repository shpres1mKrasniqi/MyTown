using Microsoft.AspNetCore.Http;

namespace MyTown.Application
{
    public interface IDocumentFileService
    {
        Task<(string filePath, string fileName, long fileSize)> SaveFileAsync(IFormFile file);
    }
}