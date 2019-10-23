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
        [Required, Display(Name = "Class Name")]
        public string ClassName { get; set; }
        [Display(Name = "Description")]
        public string Description { get; set; }
        [Required, Display(Name = "Plugin's Type")]
        public string Type { get; set; }
    }
}
