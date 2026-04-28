using FluentValidation;
using MyTown.Application.DTOs.Staff;

public class CreateStaffValidator : AbstractValidator<CreateStaffDto>
{
    public CreateStaffValidator()
    {
        RuleFor(d => d.FirstName)
            .NotEmpty().WithMessage("Emri është i detyrueshëm.")
            .Length(3, 50).WithMessage("Emri duhet të ketë 3 deri në 50 karaktere.");

        RuleFor(d => d.LastName)
            .NotEmpty().WithMessage("Mbiemri është i detyrueshëm.")
            .Length(3, 50).WithMessage("Mbiemri duhet të ketë 3 deri në 50 karaktere.");

        RuleFor(d => d.Email)
            .NotEmpty().WithMessage("Email është i detyrueshëm.")
            .EmailAddress().WithMessage("Email duhet të jetë në formatin korrekt.");

        RuleFor(d => d.Password)
           .NotEmpty().WithMessage("Password eshte i detyrueshem.")
                .MinimumLength(8).WithMessage("Password duhet te kete te pakten 8 karaktere.")
                .Must(BeStrongPassword)
                .WithMessage("Password duhet te permbaje te pakten nje numer, nje shkronje te madhe dhe nje karakter special.");

        RuleFor(d => d.Position)
            .NotEmpty().WithMessage("Pozita është e detyrueshme.")
            .Length(10, 100).WithMessage("Pozita duhet të ketë 10 deri në 100 karaktere.");

        RuleFor(d => d.DateHired)
            .NotEmpty().WithMessage("Data e punësimit është e detyrueshme.")
            .LessThanOrEqualTo((DateTime.Now)).WithMessage("Data e punësimit nuk mund të jetë në të ardhmen.");

        RuleFor(d => d.DepartmentId)
            .GreaterThan(0)
            .WithMessage("Ju lutem zgjidhni departamentin.");



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