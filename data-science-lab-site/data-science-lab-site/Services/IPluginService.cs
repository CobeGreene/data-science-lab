using System.Threading.Tasks;
using data_science_lab_site.Data.ViewModels;

namespace data_science_lab_site.Services
{
    public interface IPluginService
    {
        Task<PluginResult> GetPlugin(string owner, string repositoryName);
    }
}
