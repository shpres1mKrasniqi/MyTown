using FluentValidation;
using MyTown.Application.DTOs.Komuna;

namespace MyTown.Application.Validators
{
    public class UpdateKomunaValidator : AbstractValidator<UpdateKomuna>
    {
        public UpdateKomunaValidator()
        {
            RuleFor(k => k.Name)
                .NotEmpty().WithMessage("Emri i komunes eshte i detyrueshem.")
                .MinimumLength(2).WithMessage("Emri i komunes duhet te kete te pakten 2 karaktere.")
                .MaximumLength(200).WithMessage("Emri i komunes duhet te kete maksimumi 200 karaktere.");

            RuleFor(k => k.Description)
                .NotEmpty()
                .WithMessage("Pershkrimi nuk duhet te mbetet i zbrazet")
                .MinimumLength(10)
                .WithMessage("Pershkrimi duhet te kete minimumi 10 karaktere.")
                .MaximumLength(1000).WithMessage("Pershkrimi duhet te kete maksimumi 1000 karaktere.");
               
        }
    }
}
