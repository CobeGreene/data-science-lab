using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace data_science_lab_site.Pages.Components.PluginCard
{
    public class PluginCardViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(Plugin plugin)
        {
            return View("Default", plugin);
        }
    }
}
