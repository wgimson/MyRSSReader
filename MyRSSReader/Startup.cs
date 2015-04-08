using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MyRSSReader.Startup))]
namespace MyRSSReader
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
