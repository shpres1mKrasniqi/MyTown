namespace MyTown.Domain.Entities
{
    public class PasswordResetToken
    {
        public int Id { get; private set; }
        public int UserId { get; private set; }
        public string CodeHash { get; private set; } = null!;
        public DateTime ExpiresAt { get; private set; }
        public bool IsUsed { get; private set; }
        public DateTime CreatedAt { get; private set; }

        public User User { get; private set; } = null!;

        protected PasswordResetToken() { }

        public PasswordResetToken(int userId, string codeHash, DateTime expiresAt)
        {
            if (userId <= 0)
                throw new ArgumentException("UserId is invalid.");

            if (string.IsNullOrWhiteSpace(codeHash))
                throw new ArgumentException("Code hash is required.");

            if (expiresAt <= DateTime.UtcNow)
                throw new ArgumentException("Expiration date must be in the future.");

            UserId = userId;
            CodeHash = codeHash;
            ExpiresAt = expiresAt;
            IsUsed = false;
            CreatedAt = DateTime.UtcNow;
        }

        public bool IsExpired()
        {
            return DateTime.UtcNow > ExpiresAt;
        }

        public bool MatchesCodeHash(string codeHash)
        {
            return CodeHash == codeHash;
        }

        public bool CanBeUsed(string codeHash)
        {
            return !IsUsed && !IsExpired() && MatchesCodeHash(codeHash);
        }

        public void MarkAsUsed()
        {
            if (IsUsed)
                return;

            IsUsed = true;
        }
    }
}