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
        /// <summary>
        /// Repo thao tác dữ liệu người dùng
        /// </summary>
        private readonly IUsersRepo _repo;

        /// <summary>
        /// Repo ghi log hoạt động
        /// </summary>
        private readonly IActivityRepo _activityRepo;

        public UserService(IUsersRepo repo, IActivityRepo activityRepo) : base(repo)
        {
            _repo = repo;
            _activityRepo = activityRepo;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Đăng ký tài khoản người dùng mới
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
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
                // Ghi log đăng ký tk
                await _activityRepo.InsertLog(entity.id_nguoi_dung, "Đăng ký tài khoản mới");
                return "Thành công";
            }
            return "Lỗi hệ thống khi lưu";
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Đăng nhập hệ thống
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<object> Login(LoginRequest request)
        {
            var user = await _repo.GetByUsername(request.tendangnhap);

            if (user == null || (user != null && user.trang_thai == 0))
                return null;

            if (request.matkhau != user.matkhau)
                return null;

            // Ghi log đăng nhập tk
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
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm đổi mật khẩu tk
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
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
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm cập nhật thông tin
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
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

            // Ghi log cập nhật thông tin
            if (result)
                await _activityRepo.InsertLog(dto.id_nguoi_dung, "Cập nhật thông tin cá nhân");

            return result;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Khóa / mở khóa tài khoản
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<bool> UpdateStatus(Guid id, int status)
        {
            var result = await _repo.UpdateStatus(id, status);
            // Ghi log hoạt động
            if (result)
            {
                string action = status == 0 ? "Khóa tài khoản người dùng" : "Mở khóa tài khoản người dùng";
                await _activityRepo.InsertLog(id, action);
            }
            return result;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Xóa tk người dùng
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<bool> DeleteUser(Guid id)
        {
            var result = await _repo.DeleteUser(id);
            if (result)
                await _activityRepo.InsertLog(id, "Xóa tài khoản người dùng");
            return result;
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Lấy danh sách dự án của người dùng
        /// </summary>
        public async Task<List<UserProjectDto>> GetUserProjects(Guid userId)
        {
            var result = await _repo.GetProjectsByUserId(userId);
            return result;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Lấy thông tin người dùng theo ID
        /// </summary>
        public async Task<UsersEntity> GetById(Guid id)
        {
            var result = await _repo.GetById(id);
            return result;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Lấy danh sách bài đăng của người dùng
        /// </summary>
        public async Task<List<PostDto>> GetPostsByUserId(Guid userId)
        {
            var result = await _repo.GetPostsByUserId(userId);
            return result;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Duyệt thành viên tham gia dự án
        /// </summary>
        public async Task<bool> ApproveMember(Guid idNguoiDung, Guid idDuAn)
        {
            var result = await _repo.ApproveMember(idNguoiDung, idDuAn);
            return result;
        }
    }
}