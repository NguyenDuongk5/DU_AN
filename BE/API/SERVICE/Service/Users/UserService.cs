using DAL.Entity.Post.Dto;
using DAL.Entity.Users;
using DAL.IRepo.Activity; // Quan trọng để dùng IActivityRepo
using DAL.IRepo.Users;
using Microsoft.IdentityModel.Tokens;
using SERVICE.Base.Service;
using SERVICE.IService.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SERVICE.Service.Users
{
    public class UserService : BaseService<UsersEntity, UsersDto>, IUsersService
    {
        private readonly IUsersRepo _repo;
        private readonly IActivityRepo _activityRepo;

        // Sửa lỗi: Inject cả 2 Repo vào cùng 1 Constructor
        public UserService(IUsersRepo repo, IActivityRepo activityRepo) : base(repo)
        {
            _repo = repo;
            _activityRepo = activityRepo;
        }

        public async Task<string> Register(RegisterRequest request)
        {
            var checkUser = await _repo.GetByUsername(request.tendangnhap);
            if (checkUser != null) return "Tên đăng nhập đã tồn tại";

            var entity = new UsersEntity
            {
                id_nguoi_dung = Guid.NewGuid(),
                hoten = request.hoten,
                tendangnhap = request.tendangnhap,
                email = request.email,
                matkhau = request.matkhau,
                ngay_tao = DateTime.Now,
                ngay_cap_nhat = DateTime.Now,
                trang_thai = 1
            };

            var rowsAffected = await _repo.Insert(entity);
            if (rowsAffected > 0)
            {
                // Ghi log đăng ký thành công
                await _activityRepo.InsertLog(entity.id_nguoi_dung, "Đăng ký tài khoản mới");
                return "Thành công";
            }
            return "Lỗi hệ thống khi lưu";
        }

        public async Task<object> Login(LoginRequest request)
        {
            var user = await _repo.GetByUsername(request.tendangnhap);

            if (user == null || (user != null && user.trang_thai == 0))
                return null;

            if (request.matkhau != user.matkhau)
                return null;

            // Ghi log đăng nhập thành công
            await _activityRepo.InsertLog(user.id_nguoi_dung, "Đăng nhập hệ thống");

            return new
            {
                user = new UsersDto
                {
                    id_nguoi_dung = user.id_nguoi_dung,
                    hoten = user.hoten,
                    tendangnhap = user.tendangnhap,
                    email = user.email
                }
            };
        }

        public async Task<bool> ForgotPassword(ForgotPasswordRequest request)
        {
            var user = await _repo.GetById(request.id);
            if (user == null) return false;

            if (user.matkhau.Trim() != request.matkhaucu.Trim())
                return false;

            user.matkhau = request.matkhaumoi;
            var result = await _repo.UpdatePassword(user);

            if (result)
                await _activityRepo.InsertLog(user.id_nguoi_dung, "Đổi mật khẩu tài khoản");

            return result;
        }

        public async Task<bool> UpdateUser(UsersDto dto)
        {
            if (dto == null || dto.id_nguoi_dung == Guid.Empty) return false;

            var emailExist = await _repo.IsEmailExist(dto.email, dto.id_nguoi_dung);
            if (emailExist) throw new Exception("Email đã tồn tại");

            var entity = new UsersEntity
            {
                id_nguoi_dung = dto.id_nguoi_dung,
                hoten = dto.hoten?.Trim(),
                email = dto.email?.Trim()
            };

            var result = await _repo.UpdateUser(entity);
            if (result)
                await _activityRepo.InsertLog(dto.id_nguoi_dung, "Cập nhật thông tin cá nhân");

            return result;
        }

        public async Task<bool> UpdateStatus(Guid id, int status)
        {
            var result = await _repo.UpdateStatus(id, status);
            if (result)
            {
                string action = status == 0 ? "Khóa tài khoản người dùng" : "Mở khóa tài khoản người dùng";
                await _activityRepo.InsertLog(id, action);
            }
            return result;
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            var result = await _repo.DeleteUser(id);
            if (result)
                await _activityRepo.InsertLog(id, "Xóa tài khoản người dùng");
            return result;
        }

        // --- Các hàm lấy dữ liệu giữ nguyên ---
        public async Task<List<UserProjectDto>> GetUserProjects(Guid userId) => await _repo.GetProjectsByUserId(userId);
        public async Task<UsersEntity> GetById(Guid id) => await _repo.GetById(id);
        public async Task<List<PostDto>> GetPostsByUserId(Guid userId) => await _repo.GetPostsByUserId(userId);
        public async Task<bool> ApproveMember(Guid idNguoiDung, Guid idDuAn) => await _repo.ApproveMember(idNguoiDung, idDuAn);
    }
}