

namespace MyTown.Domain.Common
{
    public static class Guard
    {
        public static void AgainstNullOrEmpty(string? value, string paramName)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new Exception($"{paramName} nuk mundet me kan that");
        }
    }
}
