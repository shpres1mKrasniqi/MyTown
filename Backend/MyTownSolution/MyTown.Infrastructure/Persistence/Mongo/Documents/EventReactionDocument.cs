using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MyTown.Domain.Enums;

namespace MyTown.Infrastructure.Persistence.Mongo.Documents
{
    public class EventReactionDocument
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("event_id")]
        public int EventId { get; set; }

        [BsonElement("user_id")]
        public int UserId { get; set; }

        [BsonElement("reaction_type")]
        public EventReactionType ReactionType { get; set; }

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}