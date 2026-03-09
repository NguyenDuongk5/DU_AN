using DAL.Base.Repo;
using DAL.Entity.project;
using DAL.Entity.Project;
using DAL.IRepo.Project;
using Dapper;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repo.Project
{
    public class ProjectRepo : BaseRepo<ProjectEntity, ProjectDto>, IProjectRepo
    {
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy thông tin chi tiết project theo Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ProjectDto> GetById(Guid id)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                SELECT 
                    d.id,
                    d.tieu_de,
                    d.mo_ta,
                    d.mau,
                    d.id_nguoi_tao,
                    nd.hoten AS ten_nguoi_tao,
                    d.ngay_tao,
                    d.ngay_cap_nhat
                FROM du_an d
                JOIN nguoi_dung nd 
                    ON d.id_nguoi_tao = nd.id_nguoi_dung
                WHERE d.id = @id
            ";

            return await conn.QueryFirstOrDefaultAsync<ProjectDto>(sql, new { id });
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Cập nhật thông tin project
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public async Task<bool> Update(ProjectEntity e)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                    UPDATE du_an
                    SET 
                        tieu_de = @tieu_de,
                        mo_ta = @mo_ta,
                        ngay_cap_nhat = @ngay_cap_nhat
                    WHERE id = @id
                ";

            var row = await conn.ExecuteAsync(sql, new
            {
                e.id,
                e.tieu_de,
                e.mo_ta,
                e.ngay_cap_nhat
            });

            return row > 0;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm người dùng tham gia vào project
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<bool> JoinProject(JoinProjectDto dto)
        {
            using var conn = new MySqlConnection(_connectionString);

            await conn.OpenAsync();

            // kiểm tra user đã tham gia project chưa
            var existed = await conn.ExecuteScalarAsync<int>(@"
                SELECT COUNT(*)
                FROM nguoi_dung_du_an
                WHERE id_du_an = @id_du_an
                AND id_nguoi_dung = @id_nguoi_dung",
                new
                {
                    dto.id_du_an,
                    dto.id_nguoi_dung
                });
            // nếu đã tồn tại thì không cho join lại
            if (existed > 0)
                return false;

            // thêm user vào project
            var row = await conn.ExecuteAsync(@"
                INSERT INTO nguoi_dung_du_an
                (
                    id_nguoi_dung,
                    id_du_an,
                    vai_tro,
                    ngay_tham_gia
                )
                VALUES
                (
                    @id_nguoi_dung,
                    @id_du_an,
                    @vai_tro,
                    NOW()
                )",
                new
                {
                    dto.id_nguoi_dung,
                    dto.id_du_an,
                    dto.vai_tro
                });

            return row > 0;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm tạo project mới
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public async Task<bool> Insert(ProjectEntity e)
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();

            using var transaction = await conn.BeginTransactionAsync();

            try
            {
                // thêm project
                var row = await conn.ExecuteAsync(@"
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
                ", new
                {
                    e.id,
                    e.tieu_de,
                    e.mo_ta,
                    e.mau,
                    e.id_nguoi_tao,
                    e.ngay_tao,
                    e.ngay_cap_nhat
                }, transaction);

                // Thêm người tạo vào bảng thanh_vien_du_an
                await conn.ExecuteAsync(@"
                    INSERT INTO nguoi_dung_du_an
                    (
                        id_nguoi_dung,
                        id_du_an,
                        vai_tro,
                        trang_thai,
                        ngay_tham_gia
                    )
                    VALUES
                    (
                        @id_nguoi_dung,
                        @id_du_an,
                        1,
                        1,
                        NOW()
                    )
                ", new
                {
                    id_nguoi_dung = e.id_nguoi_tao,
                    id_du_an = e.id
                }, transaction);


                await transaction.CommitAsync();

                return row > 0;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<int> DeleteProject(Guid id)
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();

            using var transaction = await conn.BeginTransactionAsync();

            try
            {
                // Xóa bảng trung gian trước
                await conn.ExecuteAsync(
                    "DELETE FROM nguoi_dung_du_an WHERE id_du_an = @id",
                    new { id },
                    transaction
                );

                // Xóa project
                var result = await conn.ExecuteAsync(
                    "DELETE FROM du_an WHERE id = @id",
                    new { id },
                    transaction
                );

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        /// <summary>
        /// Hàm lấy danh sách thành viên của dự án
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        public async Task<List<ProjectMemberDto>> GetMembersByProjectId(Guid projectId)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                SELECT 
                    nd.id_nguoi_dung     AS id_nguoi_dung,
                    nd.hoten             AS ho_ten,
                    nd.email             AS email,
                    nda.trang_thai       AS trang_thai,
                    nda.vai_tro          AS vai_tro,
                    nda.ngay_tham_gia    AS ngay_tham_gia
                FROM nguoi_dung_du_an nda
                INNER JOIN nguoi_dung nd 
                    ON nda.id_nguoi_dung = nd.id_nguoi_dung
                WHERE nda.id_du_an = @projectId
            ";


            var result = await conn.QueryAsync<ProjectMemberDto>(
                sql,
                new { projectId }
            );

            return result.ToList();
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm xóa thành viên khỏi dự án
        /// </summary>
        /// <param name="idNguoiDung"></param>
        /// <param name="idDuAn"></param>
        /// <returns></returns>
        public async Task<bool> RemoveMember(Guid idNguoiDung, Guid idDuAn)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                    DELETE FROM nguoi_dung_du_an
                    WHERE id_nguoi_dung = @idNguoiDung
                    AND id_du_an = @idDuAn
                    AND vai_tro != 1
                ";

            var row = await conn.ExecuteAsync(sql, new
            {
                idNguoiDung,
                idDuAn
            });

            return row > 0;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm lấy dự án theo userId
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<ProjectDto> GetProjectByIdAndUser(Guid projectId, Guid userId)
        {
            using var conn = new MySqlConnection(_connectionString);

            var sql = @"
                SELECT 
                    d.id,
                    d.tieu_de,
                    d.mo_ta,
                    d.mau,
                    d.id_nguoi_tao,
                    nd.hoten AS ten_nguoi_tao,
                    d.ngay_tao,
                    d.ngay_cap_nhat,
                    nda.vai_tro
                FROM nguoi_dung_du_an nda

                INNER JOIN du_an d 
                    ON nda.id_du_an = d.id

                INNER JOIN nguoi_dung nd 
                    ON d.id_nguoi_tao = nd.id_nguoi_dung

                WHERE d.id = @projectId
                  AND nda.id_nguoi_dung = @userId
            ";

            return await conn.QueryFirstOrDefaultAsync<ProjectDto>(sql,new { projectId, userId });
        }



    }
}
