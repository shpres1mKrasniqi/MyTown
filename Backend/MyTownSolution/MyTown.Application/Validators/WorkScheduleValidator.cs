using FluentValidation;
using MyTown.Application.DTOs.WorkSchedule;
using MyTown.Domain.Enums;

namespace MyTown.Application.Validators
{
    public class WorkScheduleValidator : AbstractValidator<CreateWorkScheduleDto>
    {
        public WorkScheduleValidator()
        {
            RuleFor(x => x.StaffId)
                .GreaterThan(0)
                .WithMessage("Ju lutem zgjidhni stafin.");

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("Data e orarit është e detyrueshme.");

            RuleFor(x => x.DayOfWeek)
                .IsInEnum()
                .WithMessage("Dita e javës nuk është valide.");

            RuleFor(x => x.ShiftStart)
                .NotEmpty()
                .WithMessage("Ora e fillimit është e detyrueshme.");

            RuleFor(x => x.ShiftEnd)
                .NotEmpty()
                .WithMessage("Ora e përfundimit është e detyrueshme.")
                .GreaterThan(x => x.ShiftStart)
                .WithMessage("Ora e përfundimit duhet të jetë pas orës së fillimit.");

            RuleFor(x => x.ShiftType)
                .IsInEnum()
                .WithMessage("Lloji i ndërrimit nuk është valid.");

            RuleFor(x => x.Location)
                .NotEmpty()
                .WithMessage("Lokacioni është i detyrueshëm.")
                .MinimumLength(3)
                .WithMessage("Lokacioni duhet të ketë të paktën 3 karaktere.")
                .MaximumLength(100)
                .WithMessage("Lokacioni duhet të ketë maksimumi 100 karaktere.");

            RuleFor(x => x.Notes)
                .MaximumLength(500)
                .WithMessage("Shënimet duhet të kenë maksimumi 500 karaktere.")
                .When(x => !string.IsNullOrWhiteSpace(x.Notes));
        }
    }
}