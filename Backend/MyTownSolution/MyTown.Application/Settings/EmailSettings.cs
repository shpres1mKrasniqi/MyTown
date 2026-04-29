namespace MyTown.Application.Settings
{
    public class EmailSettings
    {
        public string SmtpHost { get; set; } = "smtp.gmail.com";
        public int SmtpPort { get; set; } = 587;

        public string SenderEmail { get; set; } = null!;

        public string SenderName { get; set; } = "MyTown Support";

        public string AppPassword { get; set; } = null!;

        public int ResetCodeExpirationMinutes { get; set; } = 15;

    }
}