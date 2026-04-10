using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MyTown.Application.Ports.InboundPorts;

namespace MyTown.Application.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;

        public FileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<(string fileName, string path, long size)> SaveFileAsync(IFormFile file)
        {
            var folder = Path.Combine(_env.WebRootPath, "images", "issues");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return (fileName, $"/images/issues/{fileName}", file.Length);
        }
    }
}