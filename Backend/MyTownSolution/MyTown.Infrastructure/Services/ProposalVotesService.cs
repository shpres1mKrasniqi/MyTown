using MongoDB.Driver;
using MyTown.Application.DTOs.ProjectProposals;
using MyTown.Application.Ports.InboundPorts;
using MyTown.Domain.Enums;
using MyTown.Infrastructure.Persistence.Mongo;
using MyTown.Infrastructure.Persistence.Mongo.Documents;

namespace MyTown.Infrastructure.Services
{
    public class ProposalVotesService : IProposalVotes
    {
        private readonly MongoDbContext _mongo;

        public ProposalVotesService(MongoDbContext mongo)
        {
            _mongo = mongo;
        }

        public async Task<ToggleVoteDto> ToggleVoteAsync(
            int projectProposalId,
            int citizenId,
            ProposalVoteType voteType,
            CancellationToken cancellationToken = default)
        {
            var existingVote = await _mongo.ProjectProposalVotes
                .Find(x => x.ProjectProposalId == projectProposalId && x.CitizenId == citizenId)
                .FirstOrDefaultAsync(cancellationToken);

            if (existingVote != null)
            {
                throw new InvalidOperationException(
                    $"Vota juaj tashme ekziston -> ProposalId: {existingVote.ProjectProposalId}, CitizenId: {existingVote.CitizenId}"
                );
            }

            var vote = new ProjectProposalVoteDocument
            {
                ProjectProposalId = projectProposalId,
                CitizenId = citizenId,
                VoteType = voteType,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = citizenId
            };

            try
            {
                await _mongo.ProjectProposalVotes.InsertOneAsync(
                    vote,
                    cancellationToken: cancellationToken);
            }
            catch (MongoWriteException ex)
            {
                throw new InvalidOperationException(
                    $"MONGO DUPLICATE ERROR: {ex.WriteError.Message}"
                );
            }
            return new ToggleVoteDto
            {
                ProjectProposalId = projectProposalId,
                CitizenId = citizenId,
                VoteType = voteType,
                Message = "Vota u regjistrua me sukses."
            };
        }

        public async Task<ProposalVotesSummaryDto> GetVotesAsync(
            int projectProposalId,
            int? citizenId,
            CancellationToken cancellationToken = default)
        {
            var votes = await _mongo.ProjectProposalVotes
                .Find(x => x.ProjectProposalId == projectProposalId)
                .ToListAsync(cancellationToken);

            var myVote = citizenId.HasValue
                ? votes.FirstOrDefault(x => x.CitizenId == citizenId.Value)
                : null;

            return new ProposalVotesSummaryDto
            {
                ProjectProposalId = projectProposalId,
                ForVotes = votes.Count(x => x.VoteType == ProposalVoteType.For),
                AgainstVotes = votes.Count(x => x.VoteType == ProposalVoteType.Against),
                TotalVotes = votes.Count,
                MyVote = myVote?.VoteType,
                HasVoted = myVote != null
            };
        }
    }
}