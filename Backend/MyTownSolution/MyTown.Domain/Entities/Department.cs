using MyTown.Domain.Common;


namespace MyTown.Domain.Entities
{
    public class Department : BaseEntity
    {
       
        public string Name { get; private set; }
        public string Description { get; private set; }
        public bool IsActive { get; private set; }

        // public ICollection<Staff> Staff { get; private set; } = new List<Staff>(); --------- lenti ti qitu e lidh me staff kur ta krijon crud per staffin
        public int KomunaId { get; private set; }
       // public Komuna Komuna { get; private set; }  ------ qitu arlind e lidh tani me komun kur ta krijon crud per komunen ti


        protected Department() { }

        public Department(string name, string description, int komunaId)
        {
            Name = name;
            Description = description;
            IsActive = true;
            KomunaId = komunaId;
        }
        public void Update(string name , string description)
        {
            Name = name;
            Description = description;
            UpdatedAt = DateTime.UtcNow;
        }
        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
