using System;
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
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;

namespace cema_ui.Pages
{
    public class ABMBovine : PageModel
    {
        private readonly IConfiguration Config;
        private readonly ILogger<login> _logger;
        private readonly Uri _baseUrl = new("http://192.168.100.5:30024");
        [BindProperty] public string title { get; set; }
        [BindProperty] public string tagImage { get; set; }
        [BindProperty] public bool edicion { get; set; }
        [BindProperty] public string? valid_tag { get; set; }
        [BindProperty] public string? valid_date { get; set; }
        [BindProperty] public string? valid_genre { get; set; }
        public string valid { get; set; }
        public string succes { get; set; }
        [BindProperty] public Models.Bovine? bovine { get; set; }

        public ABMBovine(ILogger<login> logger, IConfiguration configuration)
        {
            _logger = logger;
            Config = configuration;
        }
        [Route("/Bovine/ABMBovine")]
        [Route("/Bovine/ABMBovine/{id}")]
        public async Task<IActionResult> OnGet(int? id)
        {
            bovine = new Models.Bovine();
            bovine.taggingDate = null;
            valid = null;
            edicion = true;
            if (id == null)
            {
                edicion = false;
                title = "Registrar Bovino";
                return null;
            }
            else
            {
                title = "Bovino";
                string responseContent = "[]";
                try
                {
                    using var client = new HttpClient();
                    client.Timeout = TimeSpan.FromMinutes(0.5);
                    var builder = new UriBuilder
                    {
                        Scheme = Uri.UriSchemeHttp,
                        Port = Convert.ToInt32(Config["ports:users"]),
                        Host = Config["api_root"],
                        Path = "v1/bovines/" + id
                    };
                    var query = HttpUtility.ParseQueryString(builder.Query);
                    builder.Query = query.ToString()!;

                    HttpResponseMessage response = await client.GetAsync(builder.ToString());
                    if (response.IsSuccessStatusCode)
                    {
                        title = "Editar Bovino";
                        responseContent = await response.Content.ReadAsStringAsync();
                        bovine = System.Text.Json.JsonSerializer.Deserialize<Models.Bovine>(responseContent);
                        DateTime date = (DateTime)bovine.taggingDate;
                        date=date.AddDays(1);
                        bovine.taggingDate = date;
                        
                        tagImage = bovine.tag;
                        return null;
                    }
                    else if (response.StatusCode is HttpStatusCode.Unauthorized)
                    {
                        valid = "No esta autorizado a realizar esta accion";
                        return null;
                    }
                    else if (response.StatusCode is HttpStatusCode.NotFound)
                    {
                        valid = "El bovino buscado no se encuentra";
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
            valid = null;
            succes = null;
            try
            {
                if (bovine.tag == null)
                {
                    valid = "invalid";
                    valid_tag = " Ingrese caravana";
                }
                if (bovine.taggingDate == null)
                {
                    valid = "invalid";
                    valid_date = " Ingrese fecha caravaneo";
                }
                if (bovine.genre == null)
                {
                    valid = "invalid";
                    valid_genre = " Seleccione sexo";
                }
                if (valid != null)
                {
                    title = "Registrar Bovino";
                    valid = null;
                    return null;
                }
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(0.5);
                var builder = new UriBuilder
                {
                    Scheme = Uri.UriSchemeHttp,
                    Port = Convert.ToInt32(Config["ports:users"]),
                    Host = Config["api_root"],
                    Path = "v1/bovines/" + bovine.tag
                };

                var query = HttpUtility.ParseQueryString(builder.Query);
                builder.Query = query.ToString()!;
                var json = JsonConvert.SerializeObject(bovine);
                var stringContent = new StringContent(json, UnicodeEncoding.UTF8, "application/json");
                if (edicion == true)
                {
                    //Editar un bovino
                    HttpResponseMessage responsePut = await client.PutAsync(builder.ToString(), stringContent);
                    if (responsePut.IsSuccessStatusCode)
                    {
                        return Redirect("~/Principal");
                    }
                    else if (responsePut.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                    {
                        valid = " Error Usted no se encuentra autorizado";
                        return null;
                    }
                    else
                    {
                        valid = "Error al modificar los datos del bovino";
                        return null;
                    }

                }
                else
                {
                    //Registrar bovino nuevo
                    HttpResponseMessage response = await client.GetAsync(builder.ToString());
                    if (response.IsSuccessStatusCode)
                    {
                        valid_tag = " Esta caravana ya se encuentra en uso. Por favor, revise e intente de nuevo";
                        title = "Registrar bovino";
                        return null;
                    }
                    else if (response.StatusCode is HttpStatusCode.NotFound)
                    {
                        builder = new UriBuilder
                        {
                            Scheme = Uri.UriSchemeHttp,
                            Port = Convert.ToInt32(Config["ports:users"]),
                            Host = Config["api_root"],
                            Path = "v1/bovines/"
                        };

                        query = HttpUtility.ParseQueryString(builder.Query);

                        builder.Query = query.ToString()!;
                        HttpResponseMessage responsePost = await client.PostAsync(builder.ToString(), stringContent);
                        if (responsePost.IsSuccessStatusCode)
                        {
                            title = "Registrar bovino";
                            succes = "El bovino se a guardado correctamente";
                            bovine = new Models.Bovine();
                            tagImage = "0";
                            return null;
                        }
                        else if (responsePost.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                        {
                            valid = " Error Usted no se encuentra autorizado";
                            return null;
                        }
                        else if (responsePost.StatusCode is HttpStatusCode.Conflict)
                        {
                            valid_tag = " Esta caravana ya se encuentra en uso. Por favor, revise e intente de nuevo";
                            return null;
                        }
                        else
                        {
                            valid = "Error al guardar el bovino";
                            return null;
                        }
                    }
                    else
                    {
                        valid = "Error al validar la exitencia del bovino.";
                        return null;
                    }
                }
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
                if (bovine.tag == null)
                {
                    valid = "Debe ingresar el tag del bovino a eliminar";
                    return null;
                }
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromMinutes(0.5);
                var builder = new UriBuilder
                {
                    Scheme = Uri.UriSchemeHttp,
                    Port = Convert.ToInt32(Config["ports:users"]),
                    Host = Config["api_root"],
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
                        responseContent = await response.Content.ReadAsStringAsync();
                        return Redirect("~/Principal");

                    }
                    else if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                    {
                        valid = "Error Usted no se encuentra autorizado";
                        return null;
                    }
                }
                else if (response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.NotFound)
                {
                    valid = "No se encuntra el bovino que intenta eliminar";
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
}
