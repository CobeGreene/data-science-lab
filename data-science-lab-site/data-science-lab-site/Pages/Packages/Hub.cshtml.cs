using System.Collections.Generic;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace data_science_lab_site.Pages.Packages
{
    [AllowAnonymous]
    public class HubModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public HubModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<PluginPackage> Packages { get; set; } = new List<PluginPackage>();

        public IActionResult OnGet()
        {
            Packages = _context.Packages;
            return Page();
        }
    }
}