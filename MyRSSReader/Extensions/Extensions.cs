using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace MyRSSReader.Extensions
{
    public static class Extensions
    {
        public static bool Contains(this string src, string toCheck, StringComparison comp)
        {
            return (src.NormalizeStringAsString().IndexOf(toCheck.NormalizeStringAsString(), comp) >= 0);
        }

        public static bool ContainsIgnoreCase(this string src, string toCheck)
        {
            return (src.NormalizeStringAsString().Contains(toCheck.NormalizeStringAsString(), StringComparison.OrdinalIgnoreCase));
        }

        public static bool ElementContains(this XElement src, string toCheck, StringComparison comp)
        {
            return (src.NormalizeElementAsString().Contains(toCheck.NormalizeStringAsString(), comp));
        }

        public static bool ElementContainsIgnoreCase(this XElement src, string toCheck)
        {
            return (src.NormalizeElementAsElement().ElementContains(toCheck.NormalizeStringAsString(), StringComparison.OrdinalIgnoreCase));
        }

        public static string NormalizeElementAsString(this XElement elem)
        {
            var str = elem.ToString();
            return (string.IsNullOrEmpty(str) ? "" : str);
        }

        public static XElement NormalizeElementAsElement(this XElement elem)
        {
            return (elem == null ? new XElement("NullElement") : elem);
        }

        public static string NormalizeStringAsString(this string src)
        {
            return (string.IsNullOrEmpty(src) ? "" : src);
        }
    }
}