

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MyTown.Infrastructure.Persistence.Mongo.Documents
{
    public class ProjectProposalVoteDocument
    {
        [BsonId]
        public ObjectId Id { get; set; }


        [BsonElement("project_proposal_id")]
        public int ProjectProposalId { get; set; } 

        [BsonElement("user_id")]
        public int UserId { get; set; }

        [BsonElement("is_pro_vote")]
        public bool IsProVote { get; set; }

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [BsonElement("created_by")]
        public int CreatedBy { get; set; }

        [BsonElement("updated_by")]
        public int? UpdatedBy { get; set; }
    }
}
