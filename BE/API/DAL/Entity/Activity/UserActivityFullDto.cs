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
        public string? hoten { get; set; }  // Thêm dấu ?
        public string? email { get; set; }  // Thêm dấu ?
        public string? hanh_dong { get; set; } // Thêm dấu ?
        public DateTime thoi_gian { get; set; }
    }
}
