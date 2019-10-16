using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Constants;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using data_science_lab_site.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace data_science_lab_site.Pages.Plugins
{
    [Authorize(Roles = IdentityRoleConstants.Contributor)]
    public class PublishModel : PageModel
    {
        private readonly IPluginService _pluginService;
        private readonly ApplicationDbContext _context;

        public PublishModel(IPluginService pluginService, ApplicationDbContext context)
        {
            _pluginService = pluginService;
            _context = context;
        }

        [BindProperty]
        public Plugin Plugin { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
                return Page();

            var user = _context.Users.Single(u => u.Email.Equals(User.Identity.Name));

            if (_context.Plugins.FirstOrDefault(p => p.Name.Equals(Plugin.Name)) != null)
            {
                ModelState.AddModelError(string.Empty, "Must have a unique plugin name.");
                return Page();
            }

            var pluginResult = await _pluginService.GetPlugin(Plugin.Owner, Plugin.RepositoryName);

            if (!pluginResult.Successful)
            {
                foreach (var error in pluginResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error);
                }
                return Page();
            }

            await _context.Entry(user).Collection(u => u.Plugins)
                .LoadAsync();

            user.Plugins.Add(Plugin);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return RedirectToPage("/Plugins/Index");
        }
    }
}