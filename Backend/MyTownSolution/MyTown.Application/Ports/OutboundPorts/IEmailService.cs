namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IEmailService
    {
        Task SendPasswordResetCodeAsync(string toEmail, string firstName, string code);
    }
}