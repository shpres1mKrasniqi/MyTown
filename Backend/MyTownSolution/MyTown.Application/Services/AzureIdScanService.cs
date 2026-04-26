using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Microsoft.Extensions.Logging;
using MyTown.Application.DTOs.IdScan;
using MyTown.Application.Ports.InboundPorts;
using System.Text.RegularExpressions;

namespace MyTown.Application.Services
{
    public class AzureIdScanService : IIdScanService
    {
        private readonly DocumentAnalysisClient _client;
        private readonly ILogger<AzureIdScanService> _logger;

        public AzureIdScanService(DocumentAnalysisClient client, ILogger<AzureIdScanService> logger)
        {
            _client = client;
            _logger = logger;
        }

        public async Task<IdScanResultDto> ExtractIdDataAsync(Stream documentStream, CancellationToken ct)
        {
            AnalyzeDocumentOperation operation;

            try
            {
                operation = await _client.AnalyzeDocumentAsync(
                    WaitUntil.Completed,
                    "prebuilt-idDocument",
                    documentStream,
                    cancellationToken: ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Azure Document Intelligence request failed.");
                throw new Exception("ID scan service is unavailable. Please try again.", ex);
            }

            var result = operation.Value;

            if (!result.Documents.Any())
                throw new Exception("No ID document detected in the uploaded image.");

            var doc = result.Documents[0];
            var fields = doc.Fields;
            var fullText = result.Content ?? string.Empty;

            foreach (var kvp in fields)
            {
                _logger.LogInformation(
                    "Field: {Key} | Type: {Type} | Content: {Content}",
                    kvp.Key,
                    kvp.Value.FieldType,
                    kvp.Value.Content);
            }

            _logger.LogInformation("Full OCR Content: {Content}", fullText);


            var firstName = FirstNonEmpty(
                ExtractField(fields, "FirstName"),
                ExtractField(fields, "GivenNames")
            );

            var lastName = FirstNonEmpty(
                ExtractField(fields, "LastName"),
                ExtractField(fields, "Surname")
            );

            var dob = FirstNonEmpty(
                ExtractField(fields, "DateOfBirth"),
                ExtractField(fields, "BirthDate")
            );

            var personalNumber = FirstNonEmpty(
                ExtractField(fields, "PersonalNumber"),
                ExtractField(fields, "DocumentNumber"),
                ExtractField(fields, "IdentityDocumentNumber")
            );

            var nationality = FirstNonEmpty(
                ExtractField(fields, "Nationality"),
                ExtractField(fields, "CountryRegion"),
                ExtractField(fields, "IssuerCountry"),
                ExtractField(fields, "Country")
            );

            var placeOfBirth = FirstNonEmpty(
                ExtractField(fields, "PlaceOfBirth")
            );


            firstName ??= ExtractByLabel(fullText, "GIVEN NAME", "EMRI");
            lastName ??= ExtractByLabel(fullText, "SURNAME", "MBIEMRI");
            dob ??= ExtractByLabel(fullText, "DATE OF BIRTH", "DATA E LINDJES", "LINDUR");
            personalNumber ??= ExtractByLabel(fullText, "PERSONAL NO", "DOCUMENT NO", "NR", "NUMRI PERSONAL");
            nationality ??= ExtractByLabel(fullText, "NATIONALITY", "SHTETËSIA", "SHTETESIA");
            placeOfBirth ??= ExtractByLabel(fullText, "PLACE OF BIRTH", "VENDI I LINDJES");


            if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
            {
                var mrz = TryExtractMrzName(fullText);

                firstName ??= mrz.FirstName;
                lastName ??= mrz.LastName;
            }

            var missing = new List<string>();
            if (string.IsNullOrWhiteSpace(firstName)) missing.Add("FirstName");
            if (string.IsNullOrWhiteSpace(lastName)) missing.Add("LastName");
            if (string.IsNullOrWhiteSpace(dob)) missing.Add("DateOfBirth");
            if (string.IsNullOrWhiteSpace(personalNumber)) missing.Add("PersonalNumber");
            if (string.IsNullOrWhiteSpace(nationality)) missing.Add("Nationality");

            return new IdScanResultDto
            {
                FirstName = NormalizeName(firstName),
                LastName = NormalizeName(lastName),
                DateOfBirth = dob,
                PersonalNumber = personalNumber,
                Nationality = nationality ?? "KOSOVAR", //Qita e kena lan se te leternjoftimi spe lexon
                PlaceOfBirth = NormalizeName(placeOfBirth),
                MissingFields = missing
            };
        }

        private static string? ExtractField(
            IReadOnlyDictionary<string, DocumentField> fields,
            string key)
        {
            if (!fields.TryGetValue(key, out var field))
                return null;

            return field.FieldType switch
            {
                DocumentFieldType.String =>
                    string.IsNullOrWhiteSpace(field.Value.AsString()?.Trim())
                        ? null
                        : field.Value.AsString()?.Trim(),

                DocumentFieldType.Date =>
                    field.Value.AsDate().ToString("yyyy-MM-dd"),

                _ =>
                    string.IsNullOrWhiteSpace(field.Content?.Trim())
                        ? null
                        : field.Content?.Trim()
            };
        }

        private static string? FirstNonEmpty(params string?[] values)
        {
            return values.FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
        }

        private static string? ExtractByLabel(string text, params string[] labels)
        {
            if (string.IsNullOrWhiteSpace(text))
                return null;

            foreach (var label in labels)
            {
                var pattern = $@"{Regex.Escape(label)}\s*[:\-]?\s*(.+)";
                var match = Regex.Match(text, pattern, RegexOptions.IgnoreCase);

                if (match.Success)
                {
                    var value = match.Groups[1].Value.Trim();

                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        // merr vetëm rreshtin e parë
                        var firstLine = value.Split('\n', '\r', StringSplitOptions.RemoveEmptyEntries)
                                             .FirstOrDefault()?.Trim();

                        if (!string.IsNullOrWhiteSpace(firstLine))
                            return firstLine;
                    }
                }
            }

            return null;
        }

        private static (string? FirstName, string? LastName) TryExtractMrzName(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return (null, null);

            var lines = text
                .Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .ToList();

            // kërko rresht MRZ që fillon me P<
            var mrzLine = lines.FirstOrDefault(x => x.StartsWith("P<"));

            if (string.IsNullOrWhiteSpace(mrzLine))
                return (null, null);

            // format tipik: P<KOSLASTNAME<<FIRSTNAME<MIDDLENAME<<<<<<
            var afterCountry = mrzLine.Length > 5 ? mrzLine.Substring(5) : null;

            if (string.IsNullOrWhiteSpace(afterCountry))
                return (null, null);

            var parts = afterCountry.Split("<<", StringSplitOptions.None);

            var lastName = parts.Length > 0 ? parts[0].Replace("<", " ").Trim() : null;
            var firstName = parts.Length > 1 ? parts[1].Replace("<", " ").Trim() : null;

            return (
                string.IsNullOrWhiteSpace(firstName) ? null : firstName,
                string.IsNullOrWhiteSpace(lastName) ? null : lastName
            );
        }

        private static string? NormalizeName(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return value;

            value = value.Trim().ToLowerInvariant();
            return string.Join(" ",
                value.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                     .Select(word => char.ToUpper(word[0]) + word[1..]));
        }
    }
}
