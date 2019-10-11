using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace data_science_lab_site.Data.ViewModels
{
    public class PluginResult
    {
        public bool Successful { get; set; }
        public IEnumerable<string> Errors { get; set; } = new List<string>();
    }
}
