
using FluentValidation;
using MyTown.Application.DTOs.Authentication;

namespace MyTown.Application.Validators
{
    public class ResetPasswordValidator : AbstractValidator<ResetPasswordRequest>
    {
        public ResetPasswordValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email duhet patjeter te plotesohet.")
                .EmailAddress().WithMessage("Format i email-it eshte i pavlefshem.");
            RuleFor(x => x.Code)
                .NotEmpty().WithMessage("Kodi duhet patjeter te plotesohet.")
                .Length(6).WithMessage("Formati i kodit eshte i pavlefshem");
            RuleFor(x => x.NewPassword)
                 .NotEmpty().WithMessage("Password eshte i detyrueshem.")
                .MinimumLength(8).WithMessage("Password duhet te kete te pakten 8 karaktere.")
                .Must(BeStrongPassword)
                .WithMessage("Password duhet te permbaje te pakten nje numer, nje shkronje te madhe dhe nje karakter special.");
        }

        private bool BeStrongPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return false;

            return password.Any(char.IsUpper)
                && password.Any(char.IsLower)
                && password.Any(char.IsDigit)
                && password.Any(ch => !char.IsLetterOrDigit(ch));
        }

    }
}
