using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data;
using data_science_lab_site.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace data_science_lab_site.Controllers
{
    [Route("api/plugins")]
    public class PluginsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PluginsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public Task<IEnumerable<Plugin>> GetAsync()
        {
            return Task.FromResult<IEnumerable<Plugin>>(_context.Plugins.ToList());
        }

        [HttpGet("{name}")]
        public Task<Plugin> Get(string name)
        {
            return _context.Plugins.SingleAsync(x => x.Name == name);
        }
    }
}
