using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using data_science_lab_site.Data.ViewModels;
using data_science_lab_site.Options;
using Microsoft.AspNetCore.Identity.UI.V3.Pages.Internal.Account;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace data_science_lab_site.Services
{
    public class PluginService : IPluginService
    {
        private readonly PackageOptions _options;

        public PluginService(PackageOptions options)
        {
            _options = options;
        }

        public PluginService(IOptions<PackageOptions> options)
        {
            _options = options.Value;
        }

        private string GetGitUrl(string owner, string repositoryName)
            => string.Format(_options.PackageUrl, owner, repositoryName);

        public async Task<PluginResult> GetPlugin(string owner, string repositoryName)
        {
            using (var httpClient = new HttpClient())
            {
                var request = await httpClient.GetAsync(GetGitUrl(owner, repositoryName));
                if (!request.IsSuccessStatusCode)
                    return new PluginResult()
                    {
                        Successful = false,
                        Errors = new List<string>()
                        {
                            "Couldn't find plugin's 'package.json'.",
                            $"Ensure {GetGitUrl(owner, repositoryName)} points to a public repository 'package.json'."
                        }
                    };

                var json = await request.Content.ReadAsStringAsync();
                var obj = JsonConvert.DeserializeObject<JObject>(json);
                var property = obj[_options.PropertyName];
                if (property != null)
                {
                    return new PluginResult()
                    {
                        Successful = true
                    };
                }
                return new PluginResult()
                {
                    Successful = false,
                    Errors = new List<string>()
                    {
                        $"'package.json' didn't contain property '{_options.PropertyName}'.",
                        $"Check the API on how to structure your package.json file."
                    }
                };
            }
        }
    }
}
