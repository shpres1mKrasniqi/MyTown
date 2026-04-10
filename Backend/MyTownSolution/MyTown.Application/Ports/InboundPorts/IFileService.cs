using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Application.Ports.InboundPorts
{
    public interface IFileService
    {
        Task<(string fileName, string path, long size)> SaveFileAsync(IFormFile file);
    }
}
