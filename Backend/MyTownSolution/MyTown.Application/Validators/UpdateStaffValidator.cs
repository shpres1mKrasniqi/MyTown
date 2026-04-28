using FluentValidation;
using MyTown.Application.DTOs.Staff;
using MyTown.Application.Validators;

namespace MyTown.Application.Validators
{
    public class UpdateStaffValidator : AbstractValidator<UpdateStaffDto>
    {
        public UpdateStaffValidator()
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

        
            RuleFor(d => d.Position)
                .NotEmpty().WithMessage("Pozita është e detyrueshme.")
                .Length(5, 30).WithMessage("Pozita duhet të ketë 5 deri në 30 karaktere.");

            RuleFor(d => d.DateHired)
                .NotEmpty().WithMessage("Data e punësimit është e detyrueshme.")
                .LessThanOrEqualTo((DateTime.Now)).WithMessage("Data e punësimit nuk mund të jetë në të ardhmen.");

            RuleFor(d => d.DepartmentId)
                .GreaterThan(0)
                .WithMessage("Ju lutem zgjidhni departamentin.");




        }
    }
}
