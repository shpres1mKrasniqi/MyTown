

using FluentValidation;
using Microsoft.AspNetCore.Http;
using MyTown.Application.DTOs.ProjectProposals;

namespace MyTown.Application.Validators
{
    public class UpdateProjectProposalValidator : AbstractValidator<UpdateProjectProposalDto>
    {
        private readonly string[] allowedExtensions =
       {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        public UpdateProjectProposalValidator()
        {
            RuleForEach(x => x.Files)
                .Must(BeValidImage)
                .WithMessage("Lejohen vetëm formatet JPG, JPEG, PNG dhe WEBP.");

            RuleFor(x=>x.Title)
                .NotEmpty().WithMessage("Titulli është i detyrueshëm.")
                .MaximumLength(200).WithMessage("Titulli nuk mund të jetë më i gjatë se 200 karaktere.")
                .MinimumLength(5).WithMessage("Titulli duhet të jetë të paktën 5 karaktere i gjatë.");

            RuleFor(x=>x.Description)
                .NotEmpty().WithMessage("Përshkrimi është i detyrueshëm.")
                .MinimumLength(10).WithMessage("Përshkrimi duhet të jetë të paktën 10 karaktere i gjatë.")
                .MaximumLength(1000).WithMessage("Përshkrimi nuk mund të jetë më i gjatë se 1000 karaktere.");

            RuleFor(x => x.Budget)
                .GreaterThan(0)
                .WithMessage("Buxheti duhet të jetë më i madh se 0.")
                .LessThan(10000000000)
                .WithMessage("Buxheti nuk mund të jetë më i madh se 10,000,000,000.");

            RuleFor(x => x.VotingDeadline)
              .Must(date => date.Date >= DateTime.UtcNow.Date)
              .WithMessage("Afati i votimit nuk mund të jetë në të kaluarën.");

            RuleFor(x => x.PlannedEndDate)
                .GreaterThan(x => x.PlannedStartDate)
                .When(x => x.PlannedStartDate.HasValue && x.PlannedEndDate.HasValue)
                .WithMessage("Data e përfundimit duhet të jetë pas datës së fillimit.");

            RuleFor(x => x.KomunaId)
                .GreaterThan(0)
                .WithMessage("ID e Komunës duhet të jetë më e madhe se 0.");

            RuleFor(x => x.TenderWinnerCompany)
                .NotEmpty().WithMessage("Emri i kompanisë fituese është i detyrueshëm.")
                .MaximumLength(200)
                .WithMessage("Emri i kompanisë fituese nuk mund të jetë më i gjatë se 200 karaktere.");

            RuleFor(x => x.Files)
                .Must(files => files == null || files.Count <= 5)
                .WithMessage("Maksimumi 5 file lejohen për projekt-propozim.")
                .Must(files => files == null || files.All(file => BeValidImage(file)))
                .WithMessage("Lejohen vetëm formatet JPG, JPEG, PNG dhe WEBP.");
        }

        private bool BeValidImage(IFormFile file)
        {
            if (file == null)
                return false;

            var extension = Path.GetExtension(file.FileName).ToLower();

            return allowedExtensions.Contains(extension);
        }
       

    }
}
