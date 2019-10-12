using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace data_science_lab_site.Pages.Plugins
{
    [AllowAnonymous]
    public class HubModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public HubModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Plugin> Plugins { get; set; } = new List<Plugin>();

        public IActionResult OnGet()
        {
            Plugins = _context.Plugins;
            return Page();
        }
    }
}