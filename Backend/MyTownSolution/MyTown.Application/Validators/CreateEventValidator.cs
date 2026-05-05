using FluentValidation;
using MyTown.Application.DTOs.Event;
namespace MyTown.Application.Validators
{
    public class CreateEventValidator : AbstractValidator<CreateEventDto>
    {
        public CreateEventValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Titulli është i detyrueshëm.")
                .MinimumLength(5).WithMessage("Titulli nuk mund te jete me i shkurter se 5 karaktere.")
                .MaximumLength(100).WithMessage("Titulli nuk mund të jetë më i gjatë se 100 karaktere.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Përshkrimi është i detyrueshëm.")
                .MaximumLength(300).WithMessage("Përshkrimi nuk mund të jetë më i gjatë se 300 karaktere.");
                
            RuleFor(x => x.Location)
                .NotEmpty().WithMessage("Lokacioni është i detyrueshëm.")
                .MaximumLength(100).WithMessage("Lokacioni nuk mund të jetë më i gjatë se 100 karaktere.");

            RuleFor(x => x.EventDate)
                .NotEmpty().WithMessage("Data e fillimit është e detyrueshme.")
                .GreaterThan(DateTime.Now).WithMessage("Data e fillimit duhet të jetë në të ardhmen.");
                

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

