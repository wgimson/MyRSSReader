using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyRSSReader.Models.Home
{
    public class Item
    {
        public string Title { get; set; }
        public string Link { get; set; }
        public DateTime PublicationDate { get; set; }
        public string Description { get; set; }
    }
}