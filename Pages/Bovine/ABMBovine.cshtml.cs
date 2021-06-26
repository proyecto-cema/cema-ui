using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using cema_ui.Models;
using Microsoft.Extensions.Logging;
using System.Text;
using Newtonsoft.Json;


namespace cema_ui.Pages
{
    public class ABMBovine : PageModel
    {
        private readonly ILogger<login> _logger;
        private readonly Uri _baseUrl = new("http://192.168.100.5:30024");
        public string title { get; set; }
        public string valid { get; set; }
        [BindProperty] public Models.Bovine bovine { get; set; }

        public ABMBovine(ILogger<login> logger)
        {
            _logger = logger;
        }
        
        public void OnGet(bool Newbool)
        {
            if (Newbool == false)
            {
                title = "Editar Bovino";
            }
            else
            {
                title = "Registrar Bovino";
            }
            //    string responseContent = "[]";
            //    try
            //    {
            //        using var client = new HttpClient();
            //        client.Timeout = TimeSpan.FromMinutes(0.5);
            //        client.BaseAddress = _baseUrl;
            //        var builder = new UriBuilder
            //        {
            //            Scheme = Uri.UriSchemeHttp,
            //            Port = 30024,
            //            Host = "192.168.100.5",
            //            Path = "v1/bovines/" + Tag
            //        };
            //        var query = HttpUtility.ParseQueryString(builder.Query);
            //        builder.Query = query.ToString()!;

            //        HttpResponseMessage response = await client.GetAsync(builder.ToString());
            //        if (response.IsSuccessStatusCode)
            //        {
            //            valid = "is-valid";
            //            responseContent = await response.Content.ReadAsStringAsync();
            //        }
            //        else if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
            //        {
            //            valid = "is-invalid";
            //            return null;
            //        }
            //        return RedirectToPage("Principal", "UserData", new { username = Tag }, "");

            //    }
            //    catch (Exception ex)
            //    {
            //        return RedirectToPage("Error", new { msg = ex.Message });
            //    }
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
                    Port = 30024,
                    Host = "192.168.100.5",
                    Path = "v1/bovines/"
                };
                var query = HttpUtility.ParseQueryString(builder.Query);
                
                builder.Query = query.ToString()!;
                HttpContent httpContent = new StringContent(JsonConvert.SerializeObject(bovine), Encoding.UTF8);
                
                HttpResponseMessage response = await client.PostAsync(builder.ToString(),httpContent);
                Console.WriteLine(response);

                if (response.IsSuccessStatusCode)
                {
                    valid = "is-valid";
                    responseContent = await response.Content.ReadAsStringAsync();
                }
                else if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                {
                    valid = "is-invalid";
                    return null;
                }

                return RedirectToPage("Principal", "UserData", new { username = bovine.tag }, "");
            }
            catch (Exception ex)
            {
                return RedirectToPage("Error", new { msg = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBovine()
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
                    Port = 30024,
                    Host = "192.168.100.5",
                    Path = "v1/bovines/" + bovine.tag
                };
                var query = HttpUtility.ParseQueryString(builder.Query);
                builder.Query = query.ToString()!;

                HttpResponseMessage response = await client.GetAsync(builder.ToString());
                if (response.IsSuccessStatusCode)
                {
                    HttpResponseMessage responseDelete = await client.DeleteAsync(builder.ToString());
                    if (response.IsSuccessStatusCode)
                    {
                        valid = "is-valid";
                        responseContent = await response.Content.ReadAsStringAsync();
                    }
                    else if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                    {
                        valid = "invalid-Delete";
                        return null;
                    }
                }
                else if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                {
                    valid = "invalid-Delete";
                    return null;
                }
                return RedirectToPage("Principal", "UserData", new { username = bovine.tag}, "");

            }
            catch (Exception ex){
                return RedirectToPage("Error", new { msg = ex.Message });
            }
        }

    }
}
