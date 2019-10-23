using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data.Models;

namespace data_science_lab_site.Data.ViewModels
{
    public class PluginViewModel
    {
        public string Name { get; set; }
        public string ClassName { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }

        public static PluginViewModel Map(Plugin plugin)
        {
            return new PluginViewModel()
            {
                Name = plugin.Name,
                ClassName = plugin.ClassName,
                Description = plugin.Description,
                Type = plugin.Type
            };
        }
    }
}
