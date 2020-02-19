using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Constants;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace data_science_lab_site.Pages.Account
{
    [Authorize(Roles = IdentityRoleConstants.Both)]
    public class ProfileModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        
        public ProfileModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public string Email { get; set; }
        public bool HasProfile { get; set;  }

        [BindProperty]
        [Required]
        [Display(Name = "Profile Image")]
        public IFormFile Profile { get; set; }

        public IActionResult OnGet()
        {
            var user = _context.Users.Single(u => u.Email.Equals(User.Identity.Name));

            Email = user.Email;
            HasProfile = !string.IsNullOrEmpty(user.ProfileMineType);

            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }


            var user = _context.Users.Single(u => u.Email.Equals(User.Identity.Name));
            
            using (var streamReader = new StreamReader(Profile.OpenReadStream()))
            {
                using (var memoryStream = new MemoryStream())
                {
                    streamReader.BaseStream.CopyTo(memoryStream);
                    user.ProfileMineType = Profile.ContentType;
                    user.Profile = memoryStream.ToArray();
                }
            }

            if (user.Profile.Length == 0)
            {
                ModelState.AddModelError("Profile", $"The file {Profile.FileName} is empty");
                return Page();
            }

            _context.Update(user);
            await _context.SaveChangesAsync();

            return RedirectToPage();
        }

    }
}
