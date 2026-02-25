using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entity.Users
{
    public class UsersDto 
    {
        public Guid id_nguoi_dung { get; set; }
        public string hoten { get; set; }
        public string email { get; set; }
        public string tendangnhap { get; set; }

    }
    public class ForgotPasswordRequest
    {
        public Guid id { get; set; }
        public string matkhaucu { get; set; }
        public string matkhaumoi { get; set; }
    }
    public class UpdateUserRequest
    {
        public string hoten { get; set; }
        public string email { get; set; }
    }
    //thêm
    public class StatusRequest
    {
        public int trang_thai { get; set; }
    }
}
