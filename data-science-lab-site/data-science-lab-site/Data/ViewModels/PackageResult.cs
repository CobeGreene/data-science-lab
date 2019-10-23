using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data.Models;

namespace data_science_lab_site.Data.ViewModels
{
    public class PackageResult
    {
        public bool Successful { get; set; }
        public IEnumerable<string> Errors { get; set; } = new List<string>();
        public IList<Plugin> Plugins { get; set; } = new List<Plugin>();
    }
}
