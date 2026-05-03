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

        public async Task<(string fileName, string path, long size)> SaveFileAsync(IFormFile file, string folder = "issues")
        {
            var uploadFolder = Path.Combine(_env.WebRootPath, "images", folder);

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(uploadFolder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return (fileName, $"/images/{folder}/{fileName}", file.Length);
        }
    }
}