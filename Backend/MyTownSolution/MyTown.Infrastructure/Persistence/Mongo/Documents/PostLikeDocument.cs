using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MyTown.Infrastructure.Persistence.Mongo.Documents;

public class PostLikeDocument
{
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("post_id")]
    public int PostId { get; set; }

    [BsonElement("user_id")]
    public int UserId { get; set; }

    [BsonElement("created_at")]
    public DateTime CreatedAt { get; set; }

    [BsonElement("created_by")]
    public int CreatedBy { get; set; }
}
