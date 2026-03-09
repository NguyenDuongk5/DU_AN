using DAL.Base.Repo;
using DAL.Entity.Comment;
using DAL.Entity.project;
using DAL.IRepo.Comment;
using Dapper;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repo.Comment
{
    public class CommentRepo : BaseRepo<CommentEntity, CommentDto>, ICommentRepo
    {
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy danh sách bình luận theo bài đăng
        /// </summary>
        /// <param name="PostId">Id của bài đăng</param>
        /// <returns>Danh sách bình luận</returns>
        public async Task<IEnumerable<CommentDto>> GetCmtByPostId(Guid PostId)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                        SELECT 
                            bl.id_binh_luan,
                            bl.id_bai_dang,
                            bl.id_nguoi_dung,
                            nd.hoten AS nguoi_dung,
                            bl.noi_dung,
                            bl.ngay_binh_luan,
                            bl.trang_thai
                        FROM binh_luan bl
                        JOIN nguoi_dung nd 
                            ON bl.id_nguoi_dung = nd.id_nguoi_dung
                        WHERE bl.id_bai_dang = @PostId
                        ORDER BY bl.ngay_binh_luan DESC
                    ";

            return await conn.QueryAsync<CommentDto>(sql, new
            {
                PostId
            });
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Thêm bình luận mới
        /// </summary>
        /// <param name="e">Entity bình luận</param>
        /// <returns>true nếu insert thành công</returns>
        public async Task<bool> Insert(CommentEntity e)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                INSERT INTO binh_luan
                (
                    id_binh_luan,
                    id_bai_dang,
                    id_nguoi_dung,
                    noi_dung,
                    trang_thai,
                    ngay_binh_luan
                )
                VALUES
                (
                    @id_binh_luan,
                    @id_bai_dang,
                    @id_nguoi_dung,
                    @noi_dung,
                    @trang_thai,
                    NOW()
                )
            ";

            var param = new
            {
                id_binh_luan = Guid.NewGuid(),
                e.id_bai_dang,
                e.id_nguoi_dung,
                e.noi_dung,
                e.trang_thai
            };

            var rows = await conn.ExecuteAsync(sql, param);

            return rows > 0;
        }


        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Cập nhật bình luận
        /// </summary>
        /// <param name="e">Entity bình luận</param>
        /// <returns>true nếu update thành công</returns>
        public async Task<bool> Update(CommentEntity e)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                UPDATE binh_luan
                SET
                    noi_dung = @noi_dung,
                    trang_thai = @trang_thai
                WHERE id_binh_luan = @id_binh_luan
            ";

            var row = await conn.ExecuteAsync(sql, e);

            return row > 0;
        }


    }
}
