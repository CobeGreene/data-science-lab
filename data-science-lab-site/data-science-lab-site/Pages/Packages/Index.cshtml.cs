using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Constants;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace data_science_lab_site.Pages.Packages
{
    [Authorize(Roles = IdentityRoleConstants.Contributor)]
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<PluginPackage> Packages { get; set; } = new List<PluginPackage>();

        public async Task<IActionResult> OnGetAsync()
        {
            var user = _context.Users.Single(u => u.Email.Equals(User.Identity.Name));

            await _context.Entry(user).Collection(u => u.Packages)
                .LoadAsync();

            Packages = user.Packages;

            return Page();
        }
    }
}