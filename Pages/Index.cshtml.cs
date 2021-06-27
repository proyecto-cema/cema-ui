using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace cema_ui.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly Uri _baseUrl = new("http://192.168.100.5:30023");
        public string valid { get; private set; }
        [BindProperty] public string Username { get; set; }
        [BindProperty] public string Password { get; set; }
        
        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }

        public async Task<IActionResult> OnPost()
        {
            string responseContent = "[]";
            try
            {
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(0.5);
                client.BaseAddress = _baseUrl;
                var builder = new UriBuilder
                {
                    Scheme = Uri.UriSchemeHttp,
                    Port = 30023,
                    Host = "192.168.100.5",
                    Path = "v1/users/login/"+Username
                };
                var query = HttpUtility.ParseQueryString(builder.Query);
                query["password"] = Password;
                builder.Query = query.ToString()!;

                HttpResponseMessage response = await client.GetAsync(builder.ToString());
                Console.WriteLine(response);

                if (response.IsSuccessStatusCode)
                {
                    valid = "is-valid";
                    responseContent = await response.Content.ReadAsStringAsync();
                }else if(response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                {
                    valid = "is-invalid";
                    return null;
                }

                return RedirectToPage("Principal", "UserData", new {username = Username}, "");
            }catch (Exception ex)
            {
                return RedirectToPage("Error", new { msg = ex.Message });
            }
        }
    }
}
