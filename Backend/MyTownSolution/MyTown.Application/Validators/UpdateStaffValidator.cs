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
                .NotEmpty().WithMessage("Emri i stafit eshte i detyrueshem.")
                .MinimumLength(3).WithMessage("Emri i stafit duhet te kete te pakten 3 karaktere.")
                .MaximumLength(50).WithMessage("Emri i stafit duhet te kete maksimumi 50 karaktere.");


            RuleFor(d => d.LastName)
                .NotEmpty().WithMessage("Pershkrimi i departamentit eshte i detyrueshem.")
                .MinimumLength(3).WithMessage("Mbiemri  duhet te kete te pakten 3 karaktere.")
                .MaximumLength(50).WithMessage("Mbiemri  duhet te kete maksimumi 50 karaktere.");

            RuleFor(d => d.Email)
             .NotEmpty().WithMessage("Email per stafin eshte i detyrueshem.")
             .NotEmpty().WithMessage("Email duhet te jete ne formatin korrekt.");

            RuleFor(d => d.Position)
         .NotEmpty().WithMessage("Position per profilin e stafit eshte i detyrueshem.")
         .MinimumLength(10).WithMessage("Position per profilin e stafit duhet te kete te pakten 10 karaktere.")
         .MaximumLength(100).WithMessage("Position per profilin e stafit  duhet te kete maksimumi 100 karaktere.");

            RuleFor(d => d.DepartmentId)
    .GreaterThan(0)
    .WithMessage("Departamenti është i detyrueshëm.");

         




        }
    }
}
