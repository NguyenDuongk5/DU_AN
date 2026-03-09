using DAL.Base.Repo;
using DAL.Entity.Post.Dto;
using DAL.Entity.Post.Entity;
using DAL.Entity.Project;
using DAL.IRepo.Post;
using Dapper;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DAL.Repo.Post
{
    public class PostRepo : BaseRepo<PostEntity, PostDto>, IPostRepo
    {
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy danh sách bài đăng theo Id dự án
        /// </summary>
        /// <param name="idDuAn">Id dự án</param>
        /// <returns>Danh sách bài đăng</returns>

        public async Task<IEnumerable<PostDto>> GetByDuAnId(Guid idDuAn)
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();

            var sql = @"
                    SELECT 
                        b.id_bai_dang,
                        b.id_du_an,
                        b.id_tac_gia,
                        u.hoten AS tac_gia,
                        b.tieu_de,
                        b.noi_dung,
                        b.anh,
                        b.trang_thai,
                        b.ngay_tao,
                        b.ngay_cap_nhat
                    FROM bai_dang b
                    JOIN nguoi_dung u ON b.id_tac_gia = u.id_nguoi_dung
                    WHERE b.id_du_an = @IdDuAn
                    ORDER BY b.ngay_tao DESC;
                ";
            return await conn.QueryAsync<PostDto>(sql, new { IdDuAn = idDuAn });
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Cập nhật bài đăng
        /// </summary>
        /// <param name="e">Entity bài đăng</param>
        /// <returns>true nếu update thành công</returns>
        public async Task<bool> Update(PostEntity e)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                    UPDATE bai_dang
                    SET 
                        tieu_de = @tieu_de,
                        noi_dung = @noi_dung,
                        anh = @anh,
                        trang_thai = @trang_thai,
                        ngay_cap_nhat = NOW()
                    WHERE id_bai_dang = @id_bai_dang
                ";

            var row = await conn.ExecuteAsync(sql, e);

            return row > 0;
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Thêm dự án
        /// </summary>
        public async Task<bool> Insert(ProjectEntity e)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                INSERT INTO du_an
                (
                    id,
                    tieu_de,
                    mo_ta,
                    mau,
                    id_nguoi_tao,
                    ngay_tao,
                    ngay_cap_nhat
                )
                VALUES
                (
                    @id,
                    @tieu_de,
                    @mo_ta,
                    @mau,
                    @id_nguoi_tao,
                    @ngay_tao,
                    @ngay_cap_nhat
                )
            ";

            var row = await conn.ExecuteAsync(sql, new
            {
                e.id,
                e.tieu_de,
                e.mo_ta,
                e.mau,
                e.id_nguoi_tao,
                e.ngay_tao,
                e.ngay_cap_nhat
            });

            return row > 0;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm thêm bài đăng
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<bool> Insert(PostEntity e)
        {
            using var conn = new MySqlConnection(_connectionString);

            // kiểm tra du_an tồn tại
            var checkSql = "SELECT COUNT(*) FROM du_an WHERE id = @id";

            var exists = await conn.ExecuteScalarAsync<int>(checkSql, new
            {
                id = e.id_du_an
            });

            if (exists == 0)
                throw new Exception("id_du_an không tồn tại");

            var sql = @"INSERT INTO bai_dang
                    (
                        id_bai_dang,
                        id_du_an,
                        id_tac_gia,
                        tieu_de,
                        noi_dung,
                        anh,
                        trang_thai,
                        ngay_tao,
                        ngay_cap_nhat
                    )
                    VALUES
                    (
                        @id_bai_dang,
                        @id_du_an,
                        @id_tac_gia,
                        @tieu_de,
                        @noi_dung,
                        @anh,
                        @trang_thai,
                        @ngay_tao,
                        @ngay_cap_nhat
                    )";

            var row = await conn.ExecuteAsync(sql, new
            {
                id_bai_dang = Guid.NewGuid(),
                e.id_du_an,
                e.id_tac_gia,
                e.tieu_de,
                e.noi_dung,
                e.anh,
                e.trang_thai ,
                ngay_tao = DateTime.Now,
                ngay_cap_nhat = DateTime.Now
            });

            return row > 0;
        }

        /// <summary>
        /// Cập nhật trạng thái bài đăng
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<bool> UpdateStatus(Guid id, int status)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                    UPDATE bai_dang
                    SET trang_thai = @status
                    WHERE id_bai_dang = @id
                ";

            var row = await conn.ExecuteAsync(sql, new
            {
                id,
                status
            });

            return row > 0;
        }


    }
}
