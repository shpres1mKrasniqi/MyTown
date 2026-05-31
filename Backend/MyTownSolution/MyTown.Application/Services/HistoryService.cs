using MyTown.Application.DTOs.History;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MyTown.Application.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly IHistoryRepository _historyRepository;

        public HistoryService(IHistoryRepository historyRepository)
        {
            _historyRepository = historyRepository;
        }
        public async Task<IEnumerable<MunicipalityHistoryDto>> GetHistoryAsync(string? type = null,
    DateTime? from = null,
    DateTime? to = null)
        {
            var history = new List<MunicipalityHistoryDto>();

            var events = await _historyRepository.GetEventsAsync();

            history.AddRange(events.Select(x =>
            new MunicipalityHistoryDto
            {
                Id = x.Id,
                EntityType = "Event",
                Title = x.Title,
                Description = x.Description,
                Date = x.EventDate,
                Location = x.Location,

            }));

            var projects = await _historyRepository.GetProjectsAsync();

            history.AddRange(projects.Select(x =>
            new MunicipalityHistoryDto
            {
                Id = x.Id,
                EntityType = "Project",
                Title = x.Title,
                Description = x.Description,
                Date = x.CreatedAt,
                Location = null,
            }));

            var meetings = await _historyRepository.GetMeetingsAsync();

            history.AddRange(meetings.Select(x =>
            new MunicipalityHistoryDto
            {
                Id = x.Id,
                EntityType = "Meeting",
                Title = x.Title,
                Description = x.Reason,
                Date = x.DateOfMeeting,
                Location = null
            }));

            var constructions = await _historyRepository.GetConstructionPermitsAsync();

            history.AddRange(constructions.Select(x =>
            new MunicipalityHistoryDto
            {
                Id = x.Id,
                EntityType = "Construction Permit",
                Title = x.Title,
                Description = x.Description,
                Date = x.CreatedAt,
                Location = null,
            }));

            var issues = await _historyRepository.GetIssuesAsync();

            history.AddRange(issues.Select(x =>
            new MunicipalityHistoryDto
            {
                Id = x.Id,
                EntityType = "Issue",
                Title = x.Title,
                Description = x.Description,
                Date = x.CreatedAt,
                Location = null,

            }));
            

            if (!string.IsNullOrWhiteSpace(type))
            {
                history = history
                    .Where(x => x.EntityType.Equals(type,
                        StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            if (from.HasValue)
            {
                history = history
                    .Where(x => x.Date >= from.Value)
                    .ToList();
            }

            if (to.HasValue)
            {
                history = history
                    .Where(x => x.Date <= to.Value)
                    .ToList();
            }

            return history
                .OrderByDescending(x => x.Date)
                .ToList();



        }
        public async Task<byte[]> ExportPdfAsync(string? type, DateTime? from, DateTime? to)
        {
            var data = await GetHistoryAsync(type, from, to);

            var pdf = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);

                    page.Header()
                        .Text("Historiku i Komunës")
                        .FontSize(20)
                        .Bold();

                    page.Content()
                        .Column(col =>
                        {
                            col.Spacing(10);

                            foreach (var item in data)
                            {
                                col.Item().BorderBottom(1).PaddingBottom(5).Column(inner =>
                                {
                                    inner.Item().Text($"{item.EntityType} - {item.Title}")
                                        .FontSize(14)
                                        .Bold();

                                    inner.Item().Text(item.Description)
                                        .FontSize(12);

                                    inner.Item().Text($"Data: {item.Date:dd/MM/yyyy}")
                                        .FontSize(10)
                                        .FontColor(Colors.Grey.Darken2);

                                    if (!string.IsNullOrEmpty(item.Location))
                                    {
                                        inner.Item().Text($"Lokacioni: {item.Location}")
                                            .FontSize(10);
                                    }
                                });
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Gjeneruar nga MyTown - ");
                            x.CurrentPageNumber();
                            x.Span(" / ");
                            x.TotalPages();
                        });
                });
            });

            return pdf.GeneratePdf();
        }
    }
}
