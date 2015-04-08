using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyRSSReader.Models.Home
{
    public class Feed
    {
        public string Url { get; set; }
        public string Title { get; set; }
        public IEnumerable<Item> Items { get; set; }
    }
}