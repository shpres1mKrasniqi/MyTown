

using FluentValidation;
using MyTown.Application.DTOs.Issues;

namespace MyTown.Application.Validators
{
    public class CreateIssueValidator : AbstractValidator<CreateIssueDto>
    {
        public CreateIssueValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Titulli është i detyrueshëm.")
                .MaximumLength(100).WithMessage("Titulli nuk mund të jetë më i gjatë se 100 karaktere.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Përshkrimi është i detyrueshëm.")
                .MaximumLength(1000).WithMessage("Përshkrimi nuk mund të jetë më i gjatë se 1000 karaktere.");

                RuleFor(x => x.KomunaId)
                     .GreaterThan(0).WithMessage("Ju lutem zgjedhni komunën.");

                RuleFor(x => x.IssueCategoryId)
                    .GreaterThan(0).WithMessage("Ju lutem zgjedhni kategorinë e problemit.");

                RuleForEach(x => x.Files)
                    .Must(file => file.Length <= 5 * 1024 * 1024) 
                    .WithMessage("Çdo file duhet të jetë më i vogël se 5MB.")
                  .Must(file =>
                        new[] { ".jpg", ".jpeg", ".png", ".pdf", ".webp" }
                        .Contains(Path.GetExtension(file.FileName).ToLower()))
                    .WithMessage("Formatet e lejuara janë: .jpg, .jpeg, .png, .pdf, .webp.");
        }
    }
}
