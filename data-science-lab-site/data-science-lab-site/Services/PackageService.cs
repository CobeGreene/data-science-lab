using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using data_science_lab_site.Data.Models;
using data_science_lab_site.Data.ViewModels;
using data_science_lab_site.Options;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace data_science_lab_site.Services
{
    public class PackageService : IPackageService
    {
        private readonly PackageOptions _options;

        public PackageService(PackageOptions options)
        {
            _options = options;
        }

        public PackageService(IOptions<PackageOptions> options)
        {
            _options = options.Value;
        }

        private string GetGitUrl(string owner, string repositoryName)
            => string.Format(_options.PackageUrl, owner, repositoryName);

        public async Task<PackageResult> GetPackage(string owner, string repositoryName)
        {
            using (var httpClient = new HttpClient())
            {
                var request = await httpClient.GetAsync(GetGitUrl(owner, repositoryName));
                if (!request.IsSuccessStatusCode)
                    return GetFailedRequestPackageResult(owner, repositoryName);

                if (GetPackagePropertyFromJson(await request.Content.ReadAsStringAsync(), out var plugins))
                {
                    return GetPluginsPackageResult(plugins);
                }
                return GetNotFoundPropertyPackageResult();
            }
        }


        private bool GetPackagePropertyFromJson(string json, out IList<Plugin> plugins)
        {
            plugins = new List<Plugin>();
            var obj = JsonConvert.DeserializeObject<JObject>(json);
            var property = obj[_options.PropertyName];
            if (!(property is JArray))
                return false;
            plugins = property.ToObject<IList<Plugin>>();
            return true;
        }

        private PackageResult GetFailedRequestPackageResult(string owner, string repositoryName)
        {
            return new PackageResult()
            {
                Successful = false,
                Errors = new List<string>()
                {
                    "Couldn't find plugin's 'package.json' on GitHub",
                    $"Ensure {GetGitUrl(owner, repositoryName)} points to a public repository 'package.json'."
                }
            };
        }

        private PackageResult GetNotFoundPropertyPackageResult()
        {
            return new PackageResult()
            {
                Successful = false,
                Errors = new List<string>()
                {
                    $"'package.json' didn't contain property '{_options.PropertyName}' as a json array.",
                    $"Check the API on how to structure your 'package.json' file."
                }
            };
        }

        private PackageResult GetPluginsPackageResult(IList<Plugin> plugins)
        {
            if (plugins.Count == 0)
            {
                return new PackageResult()
                {
                    Successful = false,
                    Errors = new List<string>()
                    {
                        $"Didn't find any plugins inside the {_options.PropertyName} property of the 'package.json' file."
                    }
                };
            }
            return new PackageResult()
            {
                Successful = true,
                Plugins = plugins
            };
        }
    }
}
