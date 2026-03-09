using DAL.Base.Repo;
using DAL.Entity.Post.Dto;
using DAL.Entity.project;
using DAL.Entity.Project;
using DAL.Entity.Users;
using DAL.IRepo.Users;
using Dapper;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repo.Users
{
    public class UsersRepo : BaseRepo<UsersEntity, UsersDto>, IUsersRepo
    {
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy danh sách dự án mà user tham gia
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<List<UserProjectDto>> GetProjectsByUserId(Guid userId)
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = @"
                SELECT 
                    da.id                AS id_du_an,
                    da.tieu_de           AS ten_du_an,
                    da.mo_ta,
                    da.mau,
                    nd.hoten             AS nguoi_tao,
                    nda.vai_tro          AS vai_tro,
                    nda.ngay_tham_gia,
                    nda.trang_thai       AS trang_thai
                FROM du_an.nguoi_dung_du_an nda

                INNER JOIN du_an.du_an da
                    ON nda.id_du_an = da.id

                INNER JOIN du_an.nguoi_dung nd
                    ON da.id_nguoi_tao = nd.id_nguoi_dung

                WHERE nda.id_nguoi_dung = @UserId

                ORDER BY nda.ngay_tham_gia DESC
            ";

            var result = await conn.QueryAsync<UserProjectDto>(
                sql,
                new { UserId = userId }
            );

            await conn.CloseAsync();

            return result.AsList();
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy user theo username hoặc email (dùng cho login)
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public async Task<UsersEntity> GetByUsername(string username)
        {
            using var conn = new MySqlConnection(_connectionString);
            // Truy vấn lấy người dùng dựa trên tên đăng nhập
            var sql = @"
                SELECT * 
                FROM nguoi_dung 
                WHERE tendangnhap = @Username OR email = @Username
                LIMIT 1";
            return await conn.QueryFirstOrDefaultAsync<UsersEntity>(sql, new { Username = username });
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm cập nhật mật khẩu 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> UpdatePassword(UsersEntity user)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                    UPDATE nguoi_dung 
                    SET matkhau = @MatKhau,
                        ngay_cap_nhat = @Now
                    WHERE id_nguoi_dung = @Id";

            var result = await conn.ExecuteAsync(sql, new
            {
                MatKhau = user.matkhau,
                Now = DateTime.Now,
                Id = user.id_nguoi_dung
            });

            return result > 0;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm cập nhật thông tin người dùng
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<bool> UpdateUser(UsersEntity entity)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                UPDATE nguoi_dung 
                SET hoten = @HoTen,
                    email = @Email,
                    ngay_cap_nhat = @Now
                WHERE id_nguoi_dung = @Id";

            var result = await conn.ExecuteAsync(sql, new
            {
                HoTen = entity.hoten,
                Email = entity.email,
                Now = DateTime.Now,
                Id = entity.id_nguoi_dung
            });

            return result >0;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm Kiểm tra email có tồn tại không
        /// </summary>
        /// <param name="email"></param>
        /// <param name="currentUserId"></param>
        /// <returns></returns>
        public async Task<bool> IsEmailExist(string email, Guid currentUserId)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                SELECT COUNT(*) 
                FROM nguoi_dung 
                WHERE email = @Email 
                AND id_nguoi_dung != @Id";

            var count = await conn.ExecuteScalarAsync<int>(sql, new
            {
                Email = email,
                Id = currentUserId
            });

            return count > 0;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy thông tin người dùng theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<UsersEntity> GetById(Guid id)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = "SELECT * FROM nguoi_dung WHERE id_nguoi_dung = @Id";

            return await conn.QueryFirstOrDefaultAsync<UsersEntity>(sql, new{Id = id});
        }
        public async Task<List<PostDto>> GetPostsByUserId(Guid userId)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                        SELECT 
                            bd.id_bai_dang,
                            bd.tieu_de,
                            bd.noi_dung,
                            bd.anh,
                            bd.trang_thai,
                            bd.ngay_tao,
                            bd.ngay_cap_nhat,
                            nd.hoten AS tac_gia
                        FROM bai_dang bd
                        JOIN nguoi_dung nd ON bd.id_tac_gia = nd.id_nguoi_dung
                        WHERE bd.id_tac_gia = @UserId
                        ORDER BY bd.ngay_cap_nhat DESC
                    ";

            var result = await conn.QueryAsync<PostDto>(sql, new { UserId = userId });

            return result.ToList();
        }

        /// <summary>
        /// Hàm duyệt thành viên tham gia dự án
        /// </summary>
        /// <param name="idNguoiDung"></param>
        /// <param name="idDuAn"></param>
        /// <returns></returns>
        public async Task<bool> ApproveMember(Guid idNguoiDung, Guid idDuAn)
        {
            using var conn = new MySqlConnection(_connectionString);

            string sql = @"
                UPDATE nguoi_dung_du_an
                SET trang_thai = 1
                WHERE id_nguoi_dung = @idNguoiDung
                AND id_du_an = @idDuAn
            ";

            var rows = await conn.ExecuteAsync(sql, new
            {
                idNguoiDung,
                idDuAn
            });

            return rows > 0;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 04/03/26
        /// Hàm xóa user
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> DeleteUser(Guid id)
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();
            using var transaction = await conn.BeginTransactionAsync();

            try
            {
                // Xóa hành động và bình luận của người dùng này
                await conn.ExecuteAsync("DELETE FROM hanh_dong_nguoi_dung WHERE id_nguoi_dung = @Id", new { Id = id }, transaction);
                await conn.ExecuteAsync("DELETE FROM binh_luan WHERE id_nguoi_dung = @Id", new { Id = id }, transaction);

                // Xóa bài đăng của người dùng này
                await conn.ExecuteAsync("DELETE FROM bai_dang WHERE id_tac_gia = @Id", new { Id = id }, transaction);

                // Xóa tất cả thành viên trong các DỰ ÁN mà người này làm chủ sở hữu
                var deleteMembersInOwnedProjectsSql = @"
                DELETE FROM nguoi_dung_du_an 
                WHERE id_du_an IN (SELECT id FROM du_an WHERE id_nguoi_tao = @Id)";
                await conn.ExecuteAsync(deleteMembersInOwnedProjectsSql, new { Id = id }, transaction);

                // Xóa các liên kết tham gia dự án cá nhân của người này
                await conn.ExecuteAsync("DELETE FROM nguoi_dung_du_an WHERE id_nguoi_dung = @Id", new { Id = id }, transaction);
                await conn.ExecuteAsync("DELETE FROM thanh_vien_du_an WHERE id_nguoi_dung = @Id", new { Id = id }, transaction);

                // Xóa dự án do người này tạo
                await conn.ExecuteAsync("DELETE FROM du_an WHERE id_nguoi_tao = @Id", new { Id = id }, transaction);

                // Xóa Người dùng
                var sql = "DELETE FROM nguoi_dung WHERE id_nguoi_dung = @Id";
                var result = await conn.ExecuteAsync(sql, new { Id = id }, transaction);

                await transaction.CommitAsync();
                return result > 0;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception($"Lỗi xóa hệ thống: {ex.Message}");
            }
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Mở / khóa tk người dùng
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<bool> UpdateStatus(Guid id, int status)
        {
            using var conn = new MySqlConnection(_connectionString);
            var sql = "UPDATE nguoi_dung SET trang_thai = @Status, ngay_cap_nhat = @Now WHERE id_nguoi_dung = @Id";
            var result = await conn.ExecuteAsync(sql, new { Status = status, Id = id, Now = DateTime.Now });
            return result > 0;
        }
       
    }


}