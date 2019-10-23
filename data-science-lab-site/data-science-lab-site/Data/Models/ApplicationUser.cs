using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace data_science_lab_site.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        [DisplayName("Packages")]
        public IList<PluginPackage> Packages { get; set; } = new List<PluginPackage>();
    }
}
