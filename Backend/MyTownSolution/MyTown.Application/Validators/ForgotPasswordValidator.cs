
using FluentValidation;
using MyTown.Application.DTOs.Authentication;

namespace MyTown.Application.Validators
{
    public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordRequest>
    {
        public ForgotPasswordValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email duhet patjeter te plotesohet.")
                .EmailAddress().WithMessage("Format i email-it eshte i pavlefshem.");
        }
    }
}
