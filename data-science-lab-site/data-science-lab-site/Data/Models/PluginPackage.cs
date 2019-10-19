using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace data_science_lab_site.Data.Models
{
    public class PluginPackage
    {
        public int Id { get; set; } 
        [Required, Display(Name = "Package's Name")]
        public string Name { get; set; }
        [Required, Display(Name = "Owner of GitHub Repository"), StringLength(256, MinimumLength = 1, ErrorMessage = "Must be between 1 and 256 characters.")]
        public string Owner { get; set; }
        [Required, Display(Name = "Repository Name"), StringLength(256, MinimumLength = 1, ErrorMessage = "Must be between 1 and 256 characters")]
        public string RepositoryName { get; set; }
        public IList<Plugin> Plugins { get; set; } = new List<Plugin>();
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
