using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cema_ui.Models
{
    public class Bovine
    {
        public string tag { get; set; }
        public string description { get; set; }
        public string genre { get; set; }
        public DateTime? taggingDate { get; set; }
    }
    public class genre
    {
        public int idGenre { set; get; }
        public string name { get; set; }
    }

}
