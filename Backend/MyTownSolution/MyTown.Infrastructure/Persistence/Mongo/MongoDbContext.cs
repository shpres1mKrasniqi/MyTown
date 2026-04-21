using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MyTown.Infrastructure.Persistence.Mongo.Documents;

namespace MyTown.Infrastructure.Persistence.Mongo
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.Database);
        }

        public IMongoDatabase Database => _database;

        public IMongoCollection<PostLikeDocument> PostLikes =>
            _database.GetCollection<PostLikeDocument>("post_likes");

        public IMongoCollection<PostCommentDocument> PostComments =>
            _database.GetCollection<PostCommentDocument>("post_comments");

        public async Task EnsureIndexesAsync(CancellationToken cancellationToken = default)
        {
            var likeKeys = Builders<PostLikeDocument>.IndexKeys.Ascending(x => x.PostId).Ascending(x => x.UserId);
            await PostLikes.Indexes.CreateOneAsync(
                new CreateIndexModel<PostLikeDocument>(likeKeys, new CreateIndexOptions { Unique = true }),
                cancellationToken: cancellationToken);

            var commentKeys = Builders<PostCommentDocument>.IndexKeys.Ascending(x => x.PostId).Ascending(x => x.CreatedAt);
            await PostComments.Indexes.CreateOneAsync(
                new CreateIndexModel<PostCommentDocument>(commentKeys),
                cancellationToken: cancellationToken);
        }
    }
}
