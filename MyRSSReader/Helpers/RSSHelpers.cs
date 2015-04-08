using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace MyRSSReader.Helpers
{
    public static class RSSHelpers
    {
        public static XDocument GetConfigurationSettings()
        {
            return (XDocument.Load(HttpContext.Current.Server.MapPath("~/Content/XML/FeedConfig.xml")));
        }
    }
}