

using FluentValidation;
using MyTown.Application.DTOs.Citizens;

namespace MyTown.Application.Validators
{
    public class RegisterCitizenValidator : AbstractValidator<CreateCitizenDto>
    {
        public RegisterCitizenValidator()
        {
            RuleFor(c => c.FirstName)
               .NotEmpty().WithMessage("Emri eshte i detyrueshem.")
               .MinimumLength(2).WithMessage("Emri duhet te kete te pakten 2 karaktere.")
               .MaximumLength(17).WithMessage("Emri duhet te kete maksimumi 17 karaktere.");

            RuleFor(c => c.LastName)
                .NotEmpty().WithMessage("Mbiemri eshte i detyrueshem.")
                .MinimumLength(2).WithMessage("Mbiemri duhet te kete te pakten 2 karaktere.")
                .MaximumLength(17).WithMessage("Mbiemri duhet te kete maksimumi 17 karaktere.");    

            RuleFor(c => c.PersonalNumber)
                .NotEmpty().WithMessage("Numri personal eshte i detyrueshem.")
                .Length(10).WithMessage("Numri personal duhet te kete 10 numra.");

            RuleFor(c => c.Email)
                .NotEmpty().WithMessage("Email eshte i detyrueshem.")
                .MinimumLength(10).WithMessage("Email duhet te kete te pakten 10 karaktere.")
                .MaximumLength(50).WithMessage("Email duhet te kete maksimumi 50 karaktere.")
                .EmailAddress().WithMessage("Email duhet te jete ne format korrekt.")
                .Must(BeFromAllowedDomain)
                .WithMessage("Lejohen vetem email nga Gmail, Outlook, Hotmail, Yahoo ose iCloud.");

            RuleFor(c => c.Password)
                .NotEmpty().WithMessage("Password eshte i detyrueshem.")
                .MinimumLength(8).WithMessage("Password duhet te kete te pakten 8 karaktere.")
                .Must(BeStrongPassword)
                .WithMessage("Password duhet te permbaje te pakten nje numer, nje shkronje te madhe dhe nje karakter special.");

            RuleFor(c => c.DateOfBirth)
                .NotEmpty().WithMessage("Data e lindjes eshte e detyrueshme.")
                .Must(BeBetween18and65Years)
                .WithMessage("Mosha duhet te jete midis 18 dhe 65 vjeç.");

            RuleFor(c => c.PhoneNumber)
             .NotEmpty().WithMessage("Numri i telefonit eshte i detyrueshem.")
             .Matches(@"^(044|045|049|043)\d{6}$")
             .WithMessage("Numri duhet te filloje me format valid kosovar dhe te kete 9 shifra.");

            RuleFor(c => c.PlaceOfBirth)
                .NotEmpty().WithMessage("Vendlindja eshte e detyrueshme.")
                .MinimumLength(3).WithMessage("Vendlindja duhet te kete te pakten 3 karaktere.")
                .MaximumLength(30).WithMessage("Vendlindja duhet te kete maksimumi 30 karaktere.");

            RuleFor(c => c.Address)
                .NotEmpty().WithMessage("Adresa eshte e detyrueshme.")
                .MinimumLength(10).WithMessage("Adresa duhet te kete te pakten 10 karaktere.")
                .MaximumLength(120).WithMessage("Adresa duhet te kete maksimumi 120 karaktere.")
                .Must(BeValidAddressFormat)
                .WithMessage("Adresa duhet te jete ne format: Komuna, Fshati/Lagjja, Rruga, Nr.Shtepise.");

            RuleFor(c => c.Nationality)
                .NotEmpty().WithMessage("Shtetesia eshte e detyrueshme.")
                .Length(7).WithMessage("Shtetesia duhet te kete 7 karaktere.")
                .Must(x => x.Equals("Kosovar", StringComparison.OrdinalIgnoreCase))
                .WithMessage("Shtetesia duhet te jete 'Kosovar'.");

            RuleFor(c => c.KomunaId)
                .GreaterThan(0)
                .WithMessage("Ju lutem zgjedhni komunen tuaj.");

        }

                private bool BeFromAllowedDomain(string email)
                {
                    if (string.IsNullOrWhiteSpace(email))
                        return false;

                    var allowedDomains = new[]
                    {
                        "gmail.com",
                        "outlook.com",
                        "hotmail.com",
                        "yahoo.com",
                        "icloud.com",
                        "live.com"
                    };

                    var domain = email.Split('@').Last().ToLower();

                    return allowedDomains.Contains(domain);
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

        private bool BeBetween18and65Years(string dateOfBirth)
        {
            if (DateTime.TryParse(dateOfBirth, out var dob))
            {
                var age = DateTime.Today.Year - dob.Year;
                if (dob > DateTime.Today.AddYears(-age)) age--;
                return age >= 18 && age <= 65;
            }
            return false;
        }


        private bool BeValidAddressFormat(string address)
        {
            if (string.IsNullOrWhiteSpace(address))
                return false;

            var parts = address.Split(',');

            if (parts.Length != 4)
                return false;

            return parts.All(p => !string.IsNullOrWhiteSpace(p.Trim()));
        }

    }
}
