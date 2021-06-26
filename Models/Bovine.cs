using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cema_ui.Models
{
    public class Bovine
    {
        public int tag { get; set; }
        public string description { get; set; }
        public gerne gerne { get; set; }
        public DateTime taggingDate { get; set; }
    }
    public class gerne
    {
        public int idGerne { set; get; }
        public string name { get; set; }
    }

}
