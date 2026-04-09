

using MyTown.Domain.Entities;

namespace MyTown.Application.Ports.OutboundPorts
{
    public interface IIssueCategoryRepository
    {
        Task AddIssueCategory(IssueCategory issueCategory);

        Task<IEnumerable<IssueCategory>> GetAllIssueCategoriesAsync();

        Task<IssueCategory?> GetIssueCategoryByIdAsync(int id);

        Task Update(IssueCategory issueCategory);

        Task Delete(IssueCategory issueCategory);
    }
}
