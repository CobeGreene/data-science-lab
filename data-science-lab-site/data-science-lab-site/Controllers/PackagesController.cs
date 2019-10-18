using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data;
using data_science_lab_site.Data.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace data_science_lab_site.Controllers
{
    [Route("api/packages")]
    public class PackagesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PackagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public Task<IEnumerable<PackageViewModel>> GetAsync()
        {
            return Task.FromResult(
                _context.Packages
                    .Include(x => x.Plugins)
                    .Include(x => x.User)
                    .Select(PackageViewModel.Map)
                );
        }

        [HttpGet("{name}")]
        public Task<IActionResult> Get(string name)
        {
            var package = _context.Packages.SingleOrDefault(x => x.Name.Equals(name));
            
            if (package == null)
                return Task.FromResult<IActionResult>(new NotFoundResult());

            _context.Entry(package).Collection(x => x.Plugins).Load();
            _context.Entry(package).Reference(x => x.User).Load();
            
            return Task.FromResult<IActionResult>(new ObjectResult(PackageViewModel.Map(package)));
        }
    }
}
