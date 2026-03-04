using DAL.Base.Repo;
using DAL.Entity.Activity;
using DAL.IRepo.Activity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySqlConnector;
using Dapper;

namespace DAL.Repo.Activity
{
    public class ActivityRepo : BaseRepo<ActivityEntity, ActivityDto>, IActivityRepo
    {
        // Hàm lấy dữ liệu để hiển thị lên bảng (Có JOIN để lấy tên và email)
        public async Task<List<UserActivityFullDto>> GetLogsWithUserInfo(Guid? userId)
        {
            using var conn = new MySqlConnection(_connectionString);
            var sql = @"
                SELECT 
                    h.id, 
                    n.hoten, 
                    n.email, 
                    h.hanh_dong, 
                    h.thoi_gian
                FROM hanh_dong_nguoi_dung h
                JOIN nguoi_dung n ON h.id_nguoi_dung = n.id_nguoi_dung
                WHERE 1=1";

            if (userId.HasValue && userId != Guid.Empty)
                sql += " AND h.id_nguoi_dung = @UserId";

            sql += " ORDER BY h.thoi_gian DESC";

            var result = await conn.QueryAsync<UserActivityFullDto>(sql, new { UserId = userId });
            return result.ToList();
        }

        // Hàm dùng chung để ghi log (Đã sửa lỗi GetConnection)
        public async Task<bool> InsertLog(Guid userId, string action)
        {
            using var conn = new MySqlConnection(_connectionString); // Dùng trực tiếp _connectionString từ BaseRepo
            var sql = @"INSERT INTO hanh_dong_nguoi_dung (id, id_nguoi_dung, hanh_dong, thoi_gian) 
                        VALUES (@id, @userId, @action, @time)";

            var result = await conn.ExecuteAsync(sql, new
            {
                id = Guid.NewGuid(),
                userId = userId,
                action = action,
                time = DateTime.Now
            });
            return result > 0;
        }
    }
}