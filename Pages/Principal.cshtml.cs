using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace cema_ui.Pages
{
    public class login : PageModel
    {
        private readonly ILogger<login> _logger;

        public login(ILogger<login> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }
    }
}
