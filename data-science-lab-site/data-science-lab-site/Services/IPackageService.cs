using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using data_science_lab_site.Data.ViewModels;

namespace data_science_lab_site.Services
{
    public interface IPackageService
    {
        Task<PackageResult> GetPackage(string owner, string repositoryName);
    }
}
