using System.Linq;
using System.Collections.Generic;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using data_science_lab_site.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace data_science_lab_site.Pages.Packages
{
    [AllowAnonymous]
    public class HubModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly PackageOptions _options;

        public HubModel(ApplicationDbContext context,
            IOptions<PackageOptions> options)
        {
            _context = context;
            _options = options.Value;
        }

        public IList<PluginPackage> Packages { get; set; } = new List<PluginPackage>();

        [BindProperty(SupportsGet = true)]
        public string Search { get; set; }

        [BindProperty(SupportsGet = true)]
        public string Type { get; set; }

        public SelectList Types => new SelectList(_options.Types.Prepend("All").ToList());

        public async Task<IActionResult> OnGetAsync()
        {
            Packages = await _context.Packages.Include(p => p.Plugins).ToListAsync();

            if (!string.IsNullOrEmpty(Search))
            {
                Packages = Packages.Where(x => x.Name.Contains(Search)).ToList();
            }

            if (!string.IsNullOrEmpty(Type) && Type != "All")
            {
                Packages = Packages
                    .Where(x => x.Plugins
                        .Count(p => p.Type.Contains(Type)) > 0)
                    .ToList();
            }

            return Page();
        }
    }
}