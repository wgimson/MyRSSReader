using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyRSSReader.Models.Home
{
    public class FeedCollection
    {
        public IEnumerable<Feed> Feeds { get; set; }
    }
}