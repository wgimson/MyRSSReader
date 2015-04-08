using MyRSSReader.Helpers;
using MyRSSReader.Models.Home;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;
using MyRSSReader.Extensions;

namespace MyRSSReader.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public PartialViewResult GetFeeds(DateTime lastStory, string searchString)
        {
            var configSettings = RSSHelpers.GetConfigurationSettings();
            var rssFeedUrls = from feed in configSettings.Descendants("feed")
                              select new
                              {
                                  Url = feed.Attribute("url").Value
                              };


            var feeds = from feed in rssFeedUrls
                        let feedDoc = XDocument.Load(feed.Url)
                        select new Feed
                        {
                            Url = feed.Url,
                            Title = feedDoc.Root.Element("channel").Element("title").Value,
                            Items = (from item in feedDoc.Descendants("item")
                                     //orderby item.Element("pubDate").Value descending
                                     select new Item
                                     {
                                         Title = item.Element("title") == null ? "No Title" : item.Element("title").Value,
                                         Link = item.Element("link") == null ? "No Link" : item.Element("link").Value,
                                         PublicationDate = item.Element("pubDate") == null ? DateTime.MinValue : Convert.ToDateTime(item.Element("pubDate").Value),
                                         Description = item.Element("description") == null ? "Description Unavailable" : item.Element("description").Value
                                     })
                        };

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                feeds = ApplySearchParameters(feeds, searchString);
            }

            return PartialView("Partials/Item", feeds);
        }

        public PartialViewResult GetFeed(string feedUrl, string searchParam)
        {
            var configSettings = RSSHelpers.GetConfigurationSettings();
            var rssFeedUrls = from feed in configSettings.Descendants("feed")
                              select new
                              {
                                  Url = feed.Attribute("url").Value
                              };


            var feeds = (from feed in rssFeedUrls
                         let feedDoc = XDocument.Load(feed.Url)
                         where feed.Url.Contains(feedUrl)
                         select new Feed
                         {
                             Url = feed.Url,
                             Title = feedDoc.Root.Element("channel").Element("title").Value,
                             Items = (from item in feedDoc.Descendants("item")
                                      //orderby item.Element("pubDate").Value descending
                                      where item.Element("title").ElementContainsIgnoreCase(searchParam) || item.Element("link").ElementContainsIgnoreCase(searchParam) ||
                                            item.Element("pubDate").ElementContainsIgnoreCase(searchParam) || item.Element("description").ElementContainsIgnoreCase(searchParam)
                                      select new Item
                                      {
                                          Title = item.Element("title") == null ? "No Title" : item.Element("title").Value,
                                          Link = item.Element("link") == null ? "No Link" : item.Element("link").Value,
                                          PublicationDate = item.Element("pubDate") == null ? DateTime.MinValue : Convert.ToDateTime(item.Element("pubDate").Value),
                                          Description = item.Element("description") == null ? "Description Unavailable" : item.Element("description").Value
                                      })
                         })
                        .FirstOrDefault();
            return PartialView("Partials/SingleItem", feeds);
        }

        public ActionResult AddConfigFeed(IEnumerable<string> newFeedUrls)
        {
            var configFile = XDocument.Load(Server.MapPath(@"\Content\Xml\FeedConfig.xml"));
            var feedParent = configFile.Root;
            if (feedParent != null)
            {
                foreach (var feedUrl in newFeedUrls)
                {
                    feedParent.Add(new XElement("feed",
                        new XAttribute("url", feedUrl)));
                }
            }
            configFile.Save(Server.MapPath(@"\Content\Xml\FeedConfig.xml"));
            return RedirectToAction("GetFeeds", new { LastStory = DateTime.MinValue, SearchString = "" });
        }

        public PartialViewResult GetAddUrlPartialView()
        {
            return PartialView("Partials/AddUrl");
        }

        private static IEnumerable<Feed> ApplySearchParameters(IEnumerable<Feed> feeds, string searchParams)
        {
            feeds = feeds.ToList();
            foreach (var feed in feeds)
            {
                var searchedItems = (from item in feed.Items
                                     where item.Description.ContainsIgnoreCase(searchParams) || item.Link.ContainsIgnoreCase(searchParams) ||
                                           item.Title.ContainsIgnoreCase(searchParams)
                                     select item).ToList();
                feed.Items = searchedItems;
            }

            IEnumerable<Feed> filteredFeeds;
            filteredFeeds = from feed in feeds
                            where feed.Items.Count() > 0
                            select feed;

            return filteredFeeds;
        }

        private static IEnumerable<Item> GetOnlyNewItems(IEnumerable<Item> items, DateTime lastStory)
        {
            return (items.Where(i => i.PublicationDate > lastStory));
        }
    }
}