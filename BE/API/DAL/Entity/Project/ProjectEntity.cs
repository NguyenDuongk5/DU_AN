using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entity.Project
{
    [Table("du_an")]
    public class ProjectEntity
    {
        [Key]
        public Guid id { get; set; } = Guid.NewGuid();
        public string tieu_de { get; set; }
        public string mo_ta { get; set; }
        public DateTime? ngay_tao { get; set; } = DateTime.Now;
        public DateTime? ngay_cap_nhat { get; set; } = DateTime.Now;
        [NotMapped]
        public string? mau { get; set; }
        public Guid id_nguoi_tao { get; set; }


    }
}
