using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace data_science_lab_site.Data.Models
{
    public class Plugin
    {
        public int Id { get; set; }
        [Required, Display(Name = "Plugin's Name")]
        public string Name { get; set; }
        [Required, Display(Name = "Github Url")]
        public string Url { get; set; }
    }
}
