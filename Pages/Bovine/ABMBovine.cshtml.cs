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
using System.IO;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace cema_ui.Pages
{
    public class ABMBovine : PageModel
    {
        private readonly ILogger<login> _logger;
        private readonly Uri _baseUrl = new("http://192.168.100.5:30024");
        public string title { get; set; }
        public string valid { get; set; }
        [BindProperty] public Models.Bovine bovine { get; set; }

        //[BindProperty]
        //public int[] SelectedgenreId { get; set; }
        //[BindProperty]
        //public List<genre> genres { get; set; }

        public ABMBovine(ILogger<login> logger)
        {
            _logger = logger;
        }

        [Route("/Bovine/ABMBovine/{id}")]
        public async Task<IActionResult> OnGet(int id)
        {
            //SelectedgenreId = new int[] { 1, 2 };
            //var Genres = new List<genre>() {
            // new genre() { idGenre = 1, name = "male" },
            // new genre() { idGenre = 2, name = "feminine" }

            //};
            //genres = new SelectList(Genres, nameof(Genres.idGenre), nameof(Genres.name), null);
            bovine = new Models.Bovine();
            bovine.taggingDate = null;
            if (id == -1)
            {
                   
                title = "Registrar Bovino";
                //bovine.genre = "male";
                return null;
            }
            else
            {
                title = "Editar Bovino";

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
                        Path = "v1/bovines/" + id
                    };
                    var query = HttpUtility.ParseQueryString(builder.Query);
                    builder.Query = query.ToString()!;

                    HttpResponseMessage response = await client.GetAsync(builder.ToString());
                    if (response.IsSuccessStatusCode)
                    {
                        valid = "is-valid";
                        responseContent = await response.Content.ReadAsStringAsync();
                        var bovin = System.Text.Json.JsonSerializer.Deserialize<Models.Bovine>(responseContent);
                        bovine = bovin;
                        return null;
                        
                        //if (bovin.genre == "male"){
                        //    bovine = 1;
                        //}
                    }
                    else if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                    {
                        valid = "is-invalid";
                        return null;
                    }
                    return null;

                }
                catch (Exception ex)
                {
                    return RedirectToPage("Error", new { msg = ex.Message });
                }
            }
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
                var json = JsonConvert.SerializeObject(bovine);
                var stringContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");
                
                HttpResponseMessage response = await client.PostAsync(builder.ToString(),stringContent);
                Console.WriteLine(response);

                if (response.IsSuccessStatusCode)
                {
                    valid = "is-valid";
                    responseContent = await response.Content.ReadAsStringAsync();
                    return Redirect("~/Principal");

                }
                else if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                {
                    valid = "is-invalid-post";
                    return null;
                }
                return null;
            }
            catch (Exception ex)
            {
                return RedirectToPage("Error", new { msg = ex.Message });
            }
        }

        public async Task<IActionResult> OnPostDelete()
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
                        return Redirect("~/Principal");

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
                return null;

            }
            catch (Exception ex){
                return RedirectToPage("Error", new { msg = ex.Message });
            }
        }

    }
}
