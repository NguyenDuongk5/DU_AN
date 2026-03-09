using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Base
{
    public class BaseResult
    {
        public bool is_success { get; set; } 
        public int status {  get; set; }
        public object data { get; set; }
        public string Message { get; set; }
    }
}
