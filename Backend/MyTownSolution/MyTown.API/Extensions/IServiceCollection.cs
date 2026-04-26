using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Services;

namespace MyTown.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAzureDocumentIntelligence(this IServiceCollection services)
        {
            var endpoint = Environment.GetEnvironmentVariable("AZURE_DOC_ENDPOINT")
                ?? throw new InvalidOperationException("Missing endpoint");

            var apiKey = Environment.GetEnvironmentVariable("AZURE_DOC_KEY")
                ?? throw new InvalidOperationException("Missing api key");

            services.AddSingleton(new DocumentAnalysisClient(
                new Uri(endpoint),
                new AzureKeyCredential(apiKey)));

            services.AddScoped<IIdScanService, AzureIdScanService>();

            return services;
        }
    }
}