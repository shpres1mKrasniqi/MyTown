

using MyTown.Domain.Common;

namespace MyTown.Domain.Entities
{
    public class IssueCategory : BaseEntity 
    {

        public string Title { get; private set; }

        public string Description { get; private set; } 

        public bool IsDeleted { get; private set; } = false;

        public ICollection<Issue> Issues { get; private set; } = new List<Issue>();
        protected IssueCategory() { }

        public IssueCategory(string title, string description, int createdBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Titulli nuk mund te lihet i zbrazet");

            if (string.IsNullOrWhiteSpace(description))
                throw new ArgumentException("Pershkrimi duhet vendosur");

            Title = title;
            Description = description;
            SetCreated(createdBy);
        }

        public void Update(string title, string description, int adminId) 
        {
            if (IsDeleted)
                throw new InvalidOperationException("Nuk mund te perditesohet kategoria e fshire.");

            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Titulli nuk mund te lihet i zbrazet");

            if (string.IsNullOrWhiteSpace(description))
                throw new ArgumentException("Pershkrimi duhet vendosur");

            Title = title;
            Description = description;
         
            SetUpdated(adminId);
        }


        public void Delete(int updatedBy)
        {
            IsDeleted = true;
            SetUpdated(updatedBy);
        }


    }
}
