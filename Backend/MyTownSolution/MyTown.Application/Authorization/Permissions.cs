

namespace MyTown.Application.Authorization
{
    public class Permissions
    {
        // Departments
        public const string CanCreateDepartment = "CanCreateDepartment";
        public const string CanViewDepartments = "CanViewDepartments";
        public const string CanUpdateDepartment = "CanUpdateDepartment";
        public const string CanDeleteDepartment = "CanDeleteDepartment";

        // Komuna
        public const string CanCreateKomuna = "CanCreateKomuna";
        public const string CanViewKomuna = "CanViewKomuna";
        public const string CanUpdateKomuna = "CanUpdateKomuna";
        public const string CanDeleteKomuna = "CanDeleteKomuna";

        // Staff
        public const string CanCreateStaff = "CanCreateStaff";
        public const string CanViewStaff = "CanViewStaff";
        public const string CanUpdateStaff = "CanUpdateStaff";
        public const string CanDeleteStaff = "CanDeleteStaff";

        // Citizens
        public const string CanCreateCitizen = "CanCreateCitizen";
        public const string CanViewCitizen = "CanViewCitizen";
        public const string CanUpdateCitizen = "CanUpdateCitizen";
        public const string CanDeleteCitizen = "CanDeleteCitizen";
    }
}
