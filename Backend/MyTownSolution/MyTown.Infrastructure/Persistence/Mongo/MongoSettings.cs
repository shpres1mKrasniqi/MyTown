using System;
using System.Collections.Generic;
using System.Text;

namespace MyTown.Infrastructure.Persistence.Mongo
{
    public class MongoSettings
    {
        public string ConnectionString { get; set; }
        public string Database { get; set; }
    }
}
