using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace MyTown.Application.DTOs.ProjectProposals
{
    public class CreateProposalValidator : AbstractValidator<CreateProposal>
    {
        private readonly string[] allowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        public CreateProposalValidator()
        {
            RuleForEach(x => x.Files)
                .Must(BeValidImage)
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