using System;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Constants;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using data_science_lab_site.Options;
using data_science_lab_site.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace data_science_lab_site.Pages.Packages
{
    [Authorize(Roles = IdentityRoleConstants.Contributor)]
    public class PublishModel : PageModel
    {
        private readonly IPackageService _packageService;
        private readonly ApplicationDbContext _context;
        private readonly PackageOptions _options;
        
        public PublishModel(IPackageService packageService, ApplicationDbContext context, IOptions<PackageOptions> options)
        {
            _packageService = packageService;
            _context = context;
            _options = options.Value;
        }

        [BindProperty]
        public PluginPackage Package { get; set; }

        [BindProperty] 
        public Stages Stage { get; set; }

        public enum Stages
        {
            Initial,
            Loaded,
            Failed,
        }

        public IActionResult OnGet()
        {
            Package = new PluginPackage();
            Stage = Stages.Initial;
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            switch (Stage)
            {
                case Stages.Initial:
                    return await InitialStage();
                case Stages.Loaded:
                    return await LoadedStage();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private async Task<IActionResult> InitialStage()
        {
            if (InvalidPackage())
                return Page();

            await LoadPluginsFromPackage();
            return Page();
        }

        private bool InvalidPackage()
        {
            if (_context.Packages.FirstOrDefault(p => p.Name.Equals(Package.Name) || p.RepositoryName.Equals(Package.RepositoryName)) != null)
                ModelState.AddModelError(string.Empty, "Must have a unique package name and unique repository name");
            return !ModelState.IsValid;
        }

        private async Task LoadPluginsFromPackage()
        {
            var packageResult = await _packageService.GetPackage(Package.Owner, Package.RepositoryName);
            if (!packageResult.Successful)
            {
                foreach (var error in packageResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error);
                }
            }
            else
            {
                Package.Plugins = packageResult.Plugins;
                Stage = Stages.Loaded;
                ModelState.Clear();
            }
        }

        private async Task<IActionResult> LoadedStage()
        {
            ValidatePluginTypes();
            if (!ModelState.IsValid)
            {
                Stage = Stages.Failed;
                return Page();
            }

            await AddPluginPackage();
            return RedirectToPage("/Packages/Index");
        }

        private void ValidatePluginTypes()
        {
            for (var i = 0; i < Package.Plugins.Count; ++i)
            {
                if (!_options.Types.Contains(Package.Plugins[i].Type))
                {
                    ModelState.AddModelError($"Package.Plugins[{i}].Type", "Invalid plugin type.");
                }
            }
        }

        private async Task AddPluginPackage()
        {
            var user = _context.Users.Single(u => u.Email.Equals(User.Identity.Name));
            await _context.Entry(user).Collection(u => u.Packages).Query()
                .Include(x => x.Plugins).LoadAsync();
            user.Packages.Add(Package);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}