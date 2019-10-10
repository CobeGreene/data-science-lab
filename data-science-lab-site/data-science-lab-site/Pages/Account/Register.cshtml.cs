using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using data_science_lab_site.Constants;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace data_science_lab_site.Pages.Account
{
    [AllowAnonymous]
    public class RegisterModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public RegisterModel(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [BindProperty]
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [BindProperty]
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [BindProperty]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        public string ConfirmPassword { get; set; }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid) return Page();

            if (!Password.Equals(ConfirmPassword))
            {
                ModelState.AddModelError(string.Empty, "Confirm Password doesn't match Password.");
                return Page();
            }

            var user = new ApplicationUser()
            {
                UserName = Email,
                Email = Email,
            };
            var result = await _userManager.CreateAsync(user, Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return Page();
            }

            await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, IdentityRoleConstants.Contributor));
            await _userManager.AddToRoleAsync(user, IdentityRoleConstants.Contributor);

            return RedirectToPage("/Account/Login");
        }

    }
}