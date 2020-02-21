using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using data_science_lab_site.Constants;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using data_science_lab_site.Options;
using data_science_lab_site.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace data_science_lab_site
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            var connectionString = System.Environment.GetEnvironmentVariable("DATA_SCIENCE_LAB_CONN_STR");
            
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    connectionString));

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
                {
                    options.Stores.MaxLengthForKeys = 128;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.ConfigureApplicationCookie(options =>
            {
                options.LoginPath = $"/account/login";
                options.LogoutPath = "/account/logout";
                options.AccessDeniedPath = "/account/accessdenied";
            });

            ConfigureDependencies(services);

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        public void ConfigureDependencies(IServiceCollection services)
        {
            services.Configure<PackageOptions>(Configuration.GetSection(nameof(PackageOptions)));

            services.AddTransient(options =>
            {
                return JsonConvert.DeserializeObject<GmailOptions>(Environment.GetEnvironmentVariable("DATA_SCIENCE_LAB_GMAIL"));
            });
            services.AddTransient<IPackageService, PackageService>();
            services.AddTransient<IEmailSender, EmailService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseAuthentication();

            app.UseMvc();
            //Seed(userManager, roleManager, context, authService).Wait();
        }

        public async Task Seed(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context)
        {
            if (await roleManager.FindByNameAsync(IdentityRoleConstants.Admin) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(IdentityRoleConstants.Admin));
            }

            if (await roleManager.FindByNameAsync(IdentityRoleConstants.Contributor) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(IdentityRoleConstants.Contributor));
            }

        }
    }
}
