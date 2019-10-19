using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace data_science_lab_site.Pages.Components.PackageCard
{
    public class PackageCardViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(PluginPackage package)
        {
            return View("Default", package);
        }
    }
}
