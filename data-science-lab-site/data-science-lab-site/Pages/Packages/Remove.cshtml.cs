using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Constants;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace data_science_lab_site.Pages.Packages
{
    [Authorize(Roles = IdentityRoleConstants.Contributor)]
    public class RemoveModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public RemoveModel(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [FromRoute]
        public int Id { get; set; }

        [BindProperty]
        public PluginPackage Package { get; set; }

        public async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.FindByIdAsync(_userManager.GetUserId(User));

            await _context.Entry(user).Collection(x => x.Packages).LoadAsync();

            Package = user.Packages.FirstOrDefault(x => x.Id == Id);

            if (Package == null) 
                return NotFound();

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var user = await _userManager.FindByIdAsync(_userManager.GetUserId(User));

            await _context.Entry(user).Collection(x => x.Packages).LoadAsync();

            Package = user.Packages.FirstOrDefault(x => x.Id == Id);

            if (Package == null)
                return NotFound();

            _context.Packages.Remove(Package);
            await _context.SaveChangesAsync();

            return RedirectToPage("/Packages/Index");
        }
    }
}
