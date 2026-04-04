namespace MyTown.Application.DTOs.StaffProfiles
{
    public class StaffListDto
    {
        public int Id { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public string DepartmentName { get; set; } = "Nuk ka te dhena";
    }
}