using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace data_science_lab_site.Controllers
{
    [Route("api/users")]
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile/{email}")]
        public async Task<IActionResult> Index(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email.Equals(email));

            if (user == null || string.IsNullOrWhiteSpace(user.ProfileMineType))
            {
                return NotFound();
            }

            return new FileContentResult(user.Profile, user.ProfileMineType);
        }
    }
}
