using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;


namespace data_science_lab_site.Pages.Packages
{
    public class DetailsModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public DetailsModel(ApplicationDbContext context)
        {
            _context = context;
        }

        [FromRoute]
        public int Id { get; set; }

        public PluginPackage Package { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {
            Package = await _context.Packages.Include(p => p.User)
                .SingleOrDefaultAsync(p => p.Id == Id);
            
            if (Package == null) return NotFound();

            return Page();
        }
    }
}
