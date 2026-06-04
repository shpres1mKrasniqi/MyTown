using MyTown.Application.DTOs.DataExchange;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Application.Ports.OutboundPorts;
using MyTown.Application;
using MyTown.Domain;
using MyTown.Domain.Entities;
using MyTown.Domain.Enums;
using System.Text;
using System.Text.Json;
using ClosedXML.Excel;


namespace MyTown.API.Services
{
    public class DataExchangeService : IDataExchangeService
    {
        private readonly IIssueRepository _issueRepo;
        private readonly IEventRepository _eventRepo;
        private readonly IProjectProposalRepository _proposalRepo;
        private readonly IMeetingRequestRepository _meetingRepo;
        private readonly IConstructionPermitRequestRepository _constructionRepo;
        private readonly IUnitOfWork _unitOfWork;

        public DataExchangeService(
            IIssueRepository issueRepo,
            IEventRepository eventRepo,
            IProjectProposalRepository proposalRepo,
            IMeetingRequestRepository meetingRepo,
            IConstructionPermitRequestRepository constructionRepo,
            IUnitOfWork unitOfWork)
        {
            _issueRepo = issueRepo;
            _eventRepo = eventRepo;
            _proposalRepo = proposalRepo;
            _meetingRepo = meetingRepo;
            _constructionRepo = constructionRepo;
            _unitOfWork = unitOfWork;
        }

        
        public async Task<byte[]> ExportToCsvAsync(string entityType)
        {
            var sb = new StringBuilder();

            switch (entityType.ToLower())
            {
                case "issues":
                    var issues = (await _issueRepo.GetAllAsync()).Where(i => !i.IsDeleted).ToList();
                    sb.AppendLine("Id,Title,Description,Status,KomunaId,IssueCategoryId,CreatedAt");
                    foreach (var i in issues)
                        sb.AppendLine($"{i.Id},{CsvEscape(i.Title)},{CsvEscape(i.Description)},{i.Status},{i.KomunaId},{i.IssueCategoryId},{i.CreatedAt:yyyy-MM-dd HH:mm:ss}");
                    break;

                case "proposals":
                    var proposals = (await _proposalRepo.GetAllProposalsAsync()).Where(p => !p.IsDeleted).ToList();
                    sb.AppendLine("Id,Title,Description,Budget,PlannedStartDate,PlannedEndDate,TenderWinnerCompany,VotingDeadline,Status,KomunaId,CreatedAt");
                    foreach (var p in proposals)
                        sb.AppendLine($"{p.Id},{CsvEscape(p.Title)},{CsvEscape(p.Description)},{p.Budget},{p.PlannedStartDate:yyyy-MM-dd},{p.PlannedEndDate:yyyy-MM-dd},{CsvEscape(p.TenderWinnerCompany ?? "")},{p.VotingDeadline:yyyy-MM-dd HH:mm:ss},{p.Status},{p.KomunaId},{p.CreatedAt:yyyy-MM-dd HH:mm:ss}");
                    break;

                case "events":
                    var events = (await _eventRepo.GetAllAsync()).Where(e => !e.IsDeleted).ToList();
                    sb.AppendLine("Id,Title,Description,EventDate,Location,Status,KomunaId,StaffId,CreatedAt");
                    foreach (var e in events)
                        sb.AppendLine($"{e.Id},{CsvEscape(e.Title)},{CsvEscape(e.Description)},{e.EventDate:yyyy-MM-dd HH:mm:ss},{CsvEscape(e.Location)},{e.Status},{e.KomunaId},{e.StaffId},{e.CreatedAt:yyyy-MM-dd HH:mm:ss}");
                    break;

                case "meetings":
                    var meetings = (await _meetingRepo.GetMeetingRequestsAsync()).Where(m => !m.IsDeleted).ToList();
                    sb.AppendLine("Id,Title,Reason,Status,DateOfMeeting,CitizenId,CreatedAt");
                    foreach (var m in meetings)
                        sb.AppendLine($"{m.Id},{CsvEscape(m.Title)},{CsvEscape(m.Reason)},{m.Status},{m.DateOfMeeting:yyyy-MM-dd HH:mm:ss},{m.CitizenId},{m.KomunaId},{m.CreatedAt:yyyy-MM-dd HH:mm:ss}");
                    break;

                case "construction-permits":
                    var permits = (await _constructionRepo.GetAllConstructionPermitRequests()).Where(c => !c.IsDeleted).ToList();
                    sb.AppendLine("Id,Title,Description,Status,CitizenId,KomunaId, CreatedAt");
                    foreach (var c in permits)
                        sb.AppendLine($"{c.Id},{CsvEscape(c.Title)},{CsvEscape(c.Description)},{c.Status},{c.CitizenId},{c.KomunaId},{c.CreatedAt:yyyy-MM-dd HH:mm:ss}");
                    break;

                default:
                    throw new ArgumentException($"Unknown entity type: {entityType}");
            }

            return Encoding.UTF8.GetBytes(sb.ToString());
        }

        
        public async Task<byte[]> ExportToExcelAsync(string entityType)
        {
            using var workbook = new XLWorkbook();

            switch (entityType.ToLower())
            {
                case "issues":
                    var issues = (await _issueRepo.GetAllAsync()).Where(i => !i.IsDeleted).ToList();
                    var wsIssues = workbook.Worksheets.Add("Issues");
                    var issueHeaders = new[] { "Id", "Title", "Description", "Status", "KomunaId", "IssueCategoryId", "CreatedAt" };
                    for (int c = 0; c < issueHeaders.Length; c++)
                        wsIssues.Cell(1, c + 1).Value = issueHeaders[c];
                    for (int r = 0; r < issues.Count; r++)
                    {
                        wsIssues.Cell(r + 2, 1).Value = issues[r].Id;
                        wsIssues.Cell(r + 2, 2).Value = issues[r].Title;
                        wsIssues.Cell(r + 2, 3).Value = issues[r].Description;
                        wsIssues.Cell(r + 2, 4).Value = issues[r].Status.ToString();
                        wsIssues.Cell(r + 2, 5).Value = issues[r].KomunaId;
                        wsIssues.Cell(r + 2, 6).Value = issues[r].IssueCategoryId;
                        wsIssues.Cell(r + 2, 7).Value = issues[r].CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    StyleWorksheet(wsIssues);
                    break;

                case "proposals":
                    var proposals = (await _proposalRepo.GetAllProposalsAsync()).Where(p => !p.IsDeleted).ToList();
                    var wsProposals = workbook.Worksheets.Add("ProjectProposals");
                    var propHeaders = new[] { "Id", "Title", "Description", "Budget", "PlannedStartDate", "PlannedEndDate", "TenderWinnerCompany", "VotingDeadline", "Status", "KomunaId", "CreatedAt" };
                    for (int c = 0; c < propHeaders.Length; c++)
                        wsProposals.Cell(1, c + 1).Value = propHeaders[c];
                    for (int r = 0; r < proposals.Count; r++)
                    {
                        var p = proposals[r];
                        wsProposals.Cell(r + 2, 1).Value = p.Id;
                        wsProposals.Cell(r + 2, 2).Value = p.Title;
                        wsProposals.Cell(r + 2, 3).Value = p.Description;
                        wsProposals.Cell(r + 2, 4).Value = (double)p.Budget;
                        wsProposals.Cell(r + 2, 5).Value = p.PlannedStartDate?.ToString("yyyy-MM-dd") ?? "";
                        wsProposals.Cell(r + 2, 6).Value = p.PlannedEndDate?.ToString("yyyy-MM-dd") ?? "";
                        wsProposals.Cell(r + 2, 7).Value = p.TenderWinnerCompany ?? "";
                        wsProposals.Cell(r + 2, 8).Value = p.VotingDeadline.ToString("yyyy-MM-dd HH:mm:ss");
                        wsProposals.Cell(r + 2, 9).Value = p.Status.ToString();
                        wsProposals.Cell(r + 2, 10).Value = p.KomunaId;
                        wsProposals.Cell(r + 2, 11).Value = p.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    StyleWorksheet(wsProposals);
                    break;

                case "events":
                    var events = (await _eventRepo.GetAllAsync()).Where(e => !e.IsDeleted).ToList();
                    var wsEvents = workbook.Worksheets.Add("Events");
                    var eventHeaders = new[] { "Id", "Title", "Description", "EventDate", "Location", "Status", "KomunaId", "StaffId", "CreatedAt" };
                    for (int c = 0; c < eventHeaders.Length; c++)
                        wsEvents.Cell(1, c + 1).Value = eventHeaders[c];
                    for (int r = 0; r < events.Count; r++)
                    {
                        var e = events[r];
                        wsEvents.Cell(r + 2, 1).Value = e.Id;
                        wsEvents.Cell(r + 2, 2).Value = e.Title;
                        wsEvents.Cell(r + 2, 3).Value = e.Description;
                        wsEvents.Cell(r + 2, 4).Value = e.EventDate.ToString("yyyy-MM-dd HH:mm:ss");
                        wsEvents.Cell(r + 2, 5).Value = e.Location;
                        wsEvents.Cell(r + 2, 6).Value = e.Status.ToString();
                        wsEvents.Cell(r + 2, 7).Value = e.KomunaId;
                        wsEvents.Cell(r + 2, 8).Value = e.StaffId;
                        wsEvents.Cell(r + 2, 9).Value = e.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    StyleWorksheet(wsEvents);
                    break;

                case "meetings":
                    var meetings = (await _meetingRepo.GetMeetingRequestsAsync()).Where(m => !m.IsDeleted).ToList();
                    var wsMeetings = workbook.Worksheets.Add("MeetingRequests");
                    var meetHeaders = new[] { "Id", "Title", "Reason", "Status", "DateOfMeeting", "CitizenId","KomunaId", "CreatedAt" };
                    for (int c = 0; c < meetHeaders.Length; c++)
                        wsMeetings.Cell(1, c + 1).Value = meetHeaders[c];
                    for (int r = 0; r < meetings.Count; r++)
                    {
                        var m = meetings[r];
                        wsMeetings.Cell(r + 2, 1).Value = m.Id;
                        wsMeetings.Cell(r + 2, 2).Value = m.Title;
                        wsMeetings.Cell(r + 2, 3).Value = m.Reason;
                        wsMeetings.Cell(r + 2, 4).Value = m.Status.ToString();
                        wsMeetings.Cell(r + 2, 5).Value = m.DateOfMeeting.ToString("yyyy-MM-dd HH:mm:ss");
                        wsMeetings.Cell(r + 2, 6).Value = m.CitizenId;
                        wsMeetings.Cell(r + 2, 7).Value = m.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    StyleWorksheet(wsMeetings);
                    break;

                case "construction-permits":
                    var permits = (await _constructionRepo.GetAllConstructionPermitRequests()).Where(c => !c.IsDeleted).ToList();
                    var wsPermits = workbook.Worksheets.Add("ConstructionPermits");
                    var permHeaders = new[] { "Id", "Title", "Description", "Status", "CitizenId", "KomunaId", "CreatedAt" };
                    for (int c = 0; c < permHeaders.Length; c++)
                        wsPermits.Cell(1, c + 1).Value = permHeaders[c];
                    for (int r = 0; r < permits.Count; r++)
                    {
                        var cp = permits[r];
                        wsPermits.Cell(r + 2, 1).Value = cp.Id;
                        wsPermits.Cell(r + 2, 2).Value = cp.Title;
                        wsPermits.Cell(r + 2, 3).Value = cp.Description;
                        wsPermits.Cell(r + 2, 4).Value = cp.Status.ToString();
                        wsPermits.Cell(r + 2, 5).Value = cp.CitizenId;
                        wsPermits.Cell(r + 2, 6).Value = cp.KomunaId;
                        wsPermits.Cell(r + 2, 7).Value = cp.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                    }
                    StyleWorksheet(wsPermits);
                    break;

                default:
                    throw new ArgumentException($"Unknown entity type: {entityType}");
            }

            using var ms = new MemoryStream();
            workbook.SaveAs(ms);
            return ms.ToArray();
        }

        
        public async Task<byte[]> ExportToJsonAsync(string entityType)
        {
            object data;

            switch (entityType.ToLower())
            {
                case "issues":
                    var issues = (await _issueRepo.GetAllAsync()).Where(i => !i.IsDeleted).ToList();
                    data = issues.Select(i => new { i.Id, i.Title, i.Description, Status = i.Status.ToString(), i.KomunaId, i.IssueCategoryId, CreatedAt = i.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss") });
                    break;
                case "proposals":
                    var proposals = (await _proposalRepo.GetAllProposalsAsync()).Where(p => !p.IsDeleted).ToList();
                    data = proposals.Select(p => new { p.Id, p.Title, p.Description, p.Budget, PlannedStartDate = p.PlannedStartDate?.ToString("yyyy-MM-dd"), PlannedEndDate = p.PlannedEndDate?.ToString("yyyy-MM-dd"), p.TenderWinnerCompany, VotingDeadline = p.VotingDeadline.ToString("yyyy-MM-dd HH:mm:ss"), Status = p.Status.ToString(), p.KomunaId, CreatedAt = p.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss") });
                    break;
                case "events":
                    var events = (await _eventRepo.GetAllAsync()).Where(e => !e.IsDeleted).ToList();
                    data = events.Select(e => new { e.Id, e.Title, e.Description, EventDate = e.EventDate.ToString("yyyy-MM-dd HH:mm:ss"), e.Location, Status = e.Status.ToString(), e.KomunaId, e.StaffId, CreatedAt = e.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss") });
                    break;
                case "meetings":
                    var meetings = (await _meetingRepo.GetMeetingRequestsAsync()).Where(m => !m.IsDeleted).ToList();
                    data = meetings.Select(m => new { m.Id, m.Title, m.Reason, Status = m.Status.ToString(), DateOfMeeting = m.DateOfMeeting.ToString("yyyy-MM-dd HH:mm:ss"), m.CitizenId, m.KomunaId, CreatedAt = m.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss") });
                    break;
                case "construction-permits":
                    var permits = (await _constructionRepo.GetAllConstructionPermitRequests()).Where(c => !c.IsDeleted).ToList();
                    data = permits.Select(c => new { c.Id, c.Title, c.Description, Status = c.Status.ToString(), c.CitizenId,c.KomunaId, CreatedAt = c.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss") });
                    break;
                default:
                    throw new ArgumentException($"Unknown entity type: {entityType}");
            }

            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            return Encoding.UTF8.GetBytes(json);
        }

       
        public async Task<ImportResultDto> ImportFromCsvAsync(string entityType, Stream fileStream, int userId, string ipAddress)
        {
            var result = new ImportResultDto();
            using var reader = new StreamReader(fileStream);
            var headerLine = await reader.ReadLineAsync();
            if (string.IsNullOrEmpty(headerLine))
            {
                result.Errors.Add("File is empty or has no header row.");
                return result;
            }

            var headers = ParseCsvLine(headerLine);
            int rowIndex = 1;

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (string.IsNullOrWhiteSpace(line)) continue;
                rowIndex++;
                result.TotalRows++;

                try
                {
                    var values = ParseCsvLine(line);
                    var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    for (int i = 0; i < Math.Min(headers.Length, values.Length); i++)
                        dict[headers[i]] = values[i];

                    await ImportRow(entityType, dict, userId);
                    result.SuccessCount++;
                }
                catch (Exception ex)
                {
                    result.ErrorCount++;
                    result.Errors.Add($"Row {rowIndex}: {ex.Message}");
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return result;
        }

       
        public async Task<ImportResultDto> ImportFromExcelAsync(string entityType, Stream fileStream, int userId, string ipAddress)
        {
            var result = new ImportResultDto();

            using var workbook = new XLWorkbook(fileStream);
            var ws = workbook.Worksheets.First();
            var headerRow = ws.Row(1);
            var headers = new List<string>();
            foreach (var cell in headerRow.CellsUsed())
                headers.Add(cell.GetString().Trim());

            var lastRow = ws.LastRowUsed()?.RowNumber() ?? 1;

            for (int row = 2; row <= lastRow; row++)
            {
                result.TotalRows++;
                try
                {
                    var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    for (int col = 0; col < headers.Count; col++)
                        dict[headers[col]] = ws.Cell(row, col + 1).GetString().Trim();

                    await ImportRow(entityType, dict, userId);
                    result.SuccessCount++;
                }
                catch (Exception ex)
                {
                    result.ErrorCount++;
                    result.Errors.Add($"Row {row}: {ex.Message}");
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return result;
        }

        
        public async Task<ImportResultDto> ImportFromJsonAsync(string entityType, Stream fileStream, int userId, string ipAddress)
        {
            var result = new ImportResultDto();

            using var reader = new StreamReader(fileStream);
            var json = await reader.ReadToEndAsync();

            var items = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (items == null || items.Count == 0)
            {
                result.Errors.Add("JSON file is empty or invalid.");
                return result;
            }

            int rowIndex = 0;
            foreach (var item in items)
            {
                rowIndex++;
                result.TotalRows++;
                try
                {
                    var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    foreach (var kvp in item)
                        dict[kvp.Key] = kvp.Value.ToString();

                    await ImportRow(entityType, dict, userId);
                    result.SuccessCount++;
                }
                catch (Exception ex)
                {
                    result.ErrorCount++;
                    result.Errors.Add($"Item {rowIndex}: {ex.Message}");
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return result;
        }

        
        private async Task ImportRow(string entityType, Dictionary<string, string> data, int userId)
        {
            switch (entityType.ToLower())
            {
                case "issues":
                    var title = data.GetValueOrDefault("Title", "");
                    var desc = data.GetValueOrDefault("Description", "");
                    var komunaId = int.Parse(data.GetValueOrDefault("KomunaId", "0"));
                    var categoryId = int.Parse(data.GetValueOrDefault("IssueCategoryId", "0"));
                    var issue = new Issue(title, desc, categoryId, userId, komunaId, IssueStatus.Pending, userId);
                    await _issueRepo.AddIssueAsync(issue);
                    break;

                case "proposals":
                    var pTitle = data.GetValueOrDefault("Title", "");
                    var pDesc = data.GetValueOrDefault("Description", "");
                    var budget = decimal.Parse(data.GetValueOrDefault("Budget", "0"));
                    var pStart = string.IsNullOrEmpty(data.GetValueOrDefault("PlannedStartDate", "")) ? (DateTime?)null : DateTime.Parse(data["PlannedStartDate"]);
                    var pEnd = string.IsNullOrEmpty(data.GetValueOrDefault("PlannedEndDate", "")) ? (DateTime?)null : DateTime.Parse(data["PlannedEndDate"]);
                    var tender = data.GetValueOrDefault("TenderWinnerCompany", null);
                    var deadline = DateTime.TryParse(data.GetValueOrDefault("VotingDeadline", ""), out var dl) ? dl : DateTime.UtcNow.AddDays(30);
                    var pKomunaId = int.Parse(data.GetValueOrDefault("KomunaId", "0"));
                    var proposal = new ProjectProposal(pTitle, pDesc, budget, pStart, pEnd, tender, deadline, pKomunaId);
                    await _proposalRepo.AddProjectProposalAsync(proposal);
                    break;

                case "events":
                    var eTitle = data.GetValueOrDefault("Title", "");
                    var eDesc = data.GetValueOrDefault("Description", "");
                    var eventDate = DateTime.TryParse(data.GetValueOrDefault("EventDate", ""), out var ed) ? ed : DateTime.UtcNow;
                    var location = data.GetValueOrDefault("Location", "");
                    var eKomunaId = int.Parse(data.GetValueOrDefault("KomunaId", "0"));
                    var staffId = int.TryParse(data.GetValueOrDefault("StaffId", ""), out var sid) ? sid : userId;
                    var ev = new Event(eTitle, eDesc, eventDate, location, eKomunaId, staffId, userId);
                    await _eventRepo.AddAsync(ev);
                    break;

                case "meetings":
                    var mTitle = data.GetValueOrDefault("Title", "");
                    var reason = data.GetValueOrDefault("Reason", "");
                    var meetDate = DateTime.TryParse(data.GetValueOrDefault("DateOfMeeting", ""), out var md) ? md : DateTime.UtcNow.AddDays(7);
                    var citizenId = int.TryParse(data.GetValueOrDefault("CitizenId", ""), out var cid) ? cid : userId;
                    var mkomunaId = int.Parse(data.GetValueOrDefault("KomunaId", "0"));
                    var meeting = new MeetingRequest(citizenId,mkomunaId, mTitle, reason, meetDate);
                    await _meetingRepo.AddMeetingRequestAsync(meeting);
                    break;

                case "construction-permits":
                    var cpTitle = data.GetValueOrDefault("Title", "");
                    var cpDesc = data.GetValueOrDefault("Description", "");
                    var cpCitizenId = int.TryParse(data.GetValueOrDefault("CitizenId", ""), out var cpCid) ? cpCid : userId;
                    var cpKomunaId = int.Parse(data.GetValueOrDefault("KomunaId", "0"));
                    var permit = new ConstructionPermitRequest(cpCitizenId, cpKomunaId, cpTitle, cpDesc);
                    await _constructionRepo.AddConstructionPermitRequestAsync(permit);
                    break;

                default:
                    throw new ArgumentException($"Unknown entity type: {entityType}");
            }
        }

        
        private static string CsvEscape(string value)
        {
            if (string.IsNullOrEmpty(value)) return "";
            if (value.Contains(',') || value.Contains('"') || value.Contains('\n') || value.Contains('\r'))
                return $"\"{value.Replace("\"", "\"\"")}\"";
            return value;
        }

        private static string[] ParseCsvLine(string line)
        {
            var result = new List<string>();
            bool inQuotes = false;
            var current = new StringBuilder();

            for (int i = 0; i < line.Length; i++)
            {
                char c = line[i];
                if (inQuotes)
                {
                    if (c == '"')
                    {
                        if (i + 1 < line.Length && line[i + 1] == '"')
                        {
                            current.Append('"');
                            i++;
                        }
                        else
                        {
                            inQuotes = false;
                        }
                    }
                    else
                    {
                        current.Append(c);
                    }
                }
                else
                {
                    if (c == '"')
                    {
                        inQuotes = true;
                    }
                    else if (c == ',')
                    {
                        result.Add(current.ToString().Trim());
                        current.Clear();
                    }
                    else
                    {
                        current.Append(c);
                    }
                }
            }
            result.Add(current.ToString().Trim());
            return result.ToArray();
        }

        private static void StyleWorksheet(IXLWorksheet ws)
        {
            var headerRange = ws.Range(1, 1, 1, ws.ColumnsUsed().Count());
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.BackgroundColor = XLColor.LightSteelBlue;
            headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            ws.Columns().AdjustToContents();
        }
    }
}
