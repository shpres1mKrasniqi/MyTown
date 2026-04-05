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
            .NotEmpty().WithMessage("Passwordi është i detyrueshëm.")
            .Length(6, 50).WithMessage("Passwordi duhet të ketë 6 deri në 50 karaktere.");

        RuleFor(d => d.Position)
            .NotEmpty().WithMessage("Pozita është e detyrueshme.")
            .Length(10, 100).WithMessage("Pozita duhet të ketë 10 deri në 100 karaktere.");
    }
}