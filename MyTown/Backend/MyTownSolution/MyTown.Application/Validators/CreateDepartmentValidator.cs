using FluentValidation;
using MyTown.Application.DTOs.Department;
using MyTown.Application.Validators;

namespace MyTown.Application.Validators
{
    public class CreateDepartmentValidator : AbstractValidator<CreateDepartment>
    {
        public CreateDepartmentValidator()
        {
            RuleFor(d => d.Name)
                .NotEmpty().WithMessage("Emri i departmentit eshte i detyrueshem.")
                .MinimumLength(3).WithMessage("Emri i departmentit duhet te kete te pakten 3 karaktere.")
                .MaximumLength(100).WithMessage("Emri i departamentit duhet te kete maksimumi 100 karaktere.");


            RuleFor(d => d.Description)
                .NotEmpty().WithMessage("Pershkrimi i departamentit eshte i detyrueshem.")
                .MinimumLength(10).WithMessage("Pershkrimi i departamentit duhet te kete te pakten 10 karaktere.")
                .MaximumLength(500).WithMessage("Pershkrimi i departamentit duhet te kete maksimumi 500 karaktere.");   

        }
    }
}
