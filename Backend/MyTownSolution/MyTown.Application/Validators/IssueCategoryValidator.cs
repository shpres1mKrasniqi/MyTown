

using FluentValidation;
using MyTown.Application.DTOs.Issues;

namespace MyTown.Application.Validators
{
    public class IssueCategoryValidator : AbstractValidator<CreateIssueCategoryDto>
    {
        public IssueCategoryValidator()
        {
            RuleFor(ic => ic.Title)
                .NotEmpty().WithMessage("Titulli është i detyrueshëm.")
                .MaximumLength(50).WithMessage("Titulli nuk mund të jetë më i gjatë se 50 karaktere.");

            RuleFor(ic => ic.Description)
                .NotEmpty().WithMessage("Përshkrimi është i detyrueshëm.")
                .MinimumLength(10).WithMessage("Përshkrimi duhet të jetë të paktën 10 karaktere.")
                .MaximumLength(200).WithMessage("Përshkrimi nuk mund të jetë më i gjatë se 200 karaktere.");
        }
    }
}
