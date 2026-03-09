using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entity.Activity
{
    public class UserActivityFullDto
    {
        public Guid id { get; set; }
        public string? hoten { get; set; }  
        public string? email { get; set; }  
        public string? hanh_dong { get; set; }
        public DateTime thoi_gian { get; set; }
    }
}
