using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data.Models;

namespace data_science_lab_site.Data.ViewModels
{
    public class PackageViewModel
    {
        public string Name { get; set; }
        public string Owner { get; set; }
        public string RepositoryName { get; set; }
        public string Username { get; set; }
        public IList<PluginViewModel> Plugins { get; set; } = new List<PluginViewModel>();

        public static PackageViewModel Map(PluginPackage package)
        {
            return new PackageViewModel()
            {
                Name = package.Name,
                Owner = package.Owner,
                RepositoryName = package.RepositoryName,
                Username = package.User.UserName,
                Plugins = package.Plugins.Select(PluginViewModel.Map).ToList()
            };
        }
    }
}
