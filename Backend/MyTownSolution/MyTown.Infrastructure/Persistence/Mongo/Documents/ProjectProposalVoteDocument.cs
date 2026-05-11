using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MyTown.Domain.Enums;

namespace MyTown.Infrastructure.Persistence.Mongo.Documents
{
    public class ProjectProposalVoteDocument
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("project_proposal_id")]
        public int ProjectProposalId { get; set; }

        [BsonElement("citizen_id")]
        public int CitizenId { get; set; }

        [BsonElement("vote_type")]
        public ProposalVoteType VoteType { get; set; }

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("created_by")]
        public int CreatedBy { get; set; }
    }
}