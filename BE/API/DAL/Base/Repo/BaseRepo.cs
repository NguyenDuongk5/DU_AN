using DAL.Base.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Reflection;
using System.Runtime.Intrinsics.Arm;
using static Dapper.SqlMapper;
using MySqlConnector;
namespace DAL.Base.Repo
{
    public class BaseRepo<Entity, Dto> : IBaseRepo<Entity, Dto>
    {
        /// <summary>
        /// Chuỗi kết nối tới database MySQL
        /// </summary>
        public const string _connectionString = "Server=localhost;Database=du_an;UserID=root;Password=2402;";

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm lấy tên bảng từ Attribute [Table] của Entity
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        private string GetNameTable()
        {
            try
            {
                var tableAttr = typeof(Entity)
                    .GetCustomAttribute<TableAttribute>();
                // Trả về tên bảng
                return tableAttr.Name;
            }
            catch
            {
                throw new Exception("Chưa khai báo bảng, hãy khai báo đi");
            }
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm lấy toàn bộ dữ liệu của bảng
        /// </summary>
        /// <returns></returns>
        public async Task<List<Entity>> GetAll()
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();

            var tableName = GetNameTable();
            var sql = $"SELECT * FROM {tableName};";

            var result = await conn.QueryAsync<Entity>(sql);
            return result.AsList();
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm Thêm dữ liệu vào bảng
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<int> Insert(Entity entity)
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();
            var tableName = GetNameTable();
            var props = typeof(Entity).GetProperties()
                .Where(p =>
                    p.CanRead &&
                    p.GetValue(entity) != null &&
                    !Attribute.IsDefined(p, typeof(NotMappedAttribute))

                );

            /// Ghép danh sách tên cột
            var columns = string.Join(",", props.Select(p => p.Name));
            /// Ghép danh sách tham số
            var values = string.Join(",", props.Select(p => "@" + p.Name));
            /// tạo câu lệnh sql
            var sql = $"INSERT INTO {tableName} ({columns})" +
                $"VALUE({values})";
            var result = await conn.ExecuteAsync(sql, entity);
            return result; 
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm xóa dữ liệu theo khóa chính
        /// </summary>
        /// <param name="pkId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<int> Delete(Guid pkId)
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();

            /// Lấy tên bảng
            var tableName = GetNameTable();
            /// Tìm property được đánh dấu key (khóa chính)
            var keyProp = typeof(Entity).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                           .FirstOrDefault(p => Attribute.IsDefined(p, typeof(KeyAttribute)));
            if (keyProp == null)
                throw new Exception("Entity phải có property [Key] để làm WHERE clause");
            var sql = $"DELETE FROM {tableName} WHERE {keyProp.Name} = @{keyProp.Name}";

            var param = new Dictionary<string, object>
            {
                { $"@{keyProp.Name}", pkId.ToString() }
            };

            var result = await conn.ExecuteAsync(sql, param);

            await conn.CloseAsync();
            return result; 
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy 1 bản ghi theo id
        /// </summary>
        /// <param name="pkId"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<Entity?> GetById(Guid pkId)
        {
            using var conn = new MySqlConnection(_connectionString);
            await conn.OpenAsync();

            // lấy tên bảng
            var tableName = GetNameTable();

            // tìm property có key
            var keyProp = typeof(Entity)
                .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .FirstOrDefault(p => Attribute.IsDefined(p, typeof(KeyAttribute)));

            if (keyProp == null)
                throw new Exception("Entity phải có [Key]");

            // tạo SQL
            var sql = $"SELECT * FROM {tableName} WHERE {keyProp.Name} = @{keyProp.Name} LIMIT 1";

            // param
            var param = new Dictionary<string, object>{{ keyProp.Name, pkId }};
            var result = await conn.QueryFirstOrDefaultAsync<Entity>(sql, param);

            return result;
        }

        //public async Task<int> Update(Entity entity)
        //{
        //    using var conn = new MySqlConnection(_connectionString);
        //    await conn.OpenAsync();

        //    var tableName = GetNameTable();

        //    // tìm khóa chính
        //    var keyProp = typeof(Entity)
        //        .GetProperties(BindingFlags.Public | BindingFlags.Instance)
        //        .FirstOrDefault(p => Attribute.IsDefined(p, typeof(KeyAttribute)));

        //    if (keyProp == null)
        //        throw new Exception("Entity phải có [Key]");

        //    var keyName = keyProp.Name;
        //    var keyValue = keyProp.GetValue(entity);

        //    if (keyValue == null)
        //        throw new Exception("Key value không được null");

        //    // lấy các field update (trừ key)
        //    var props = typeof(Entity)
        //        .GetProperties()
        //        .Where(p =>
        //            p.CanRead &&
        //            !Attribute.IsDefined(p, typeof(KeyAttribute)) &&
        //            !Attribute.IsDefined(p, typeof(NotMappedAttribute))
        //        );

        //    // tạo SET clause
        //    var setClause = string.Join(", ", props.Select(p => $"{p.Name} = @{p.Name}"));

        //    var sql = $"UPDATE {tableName} SET {setClause} WHERE {keyName} = @{keyName}";

        //    var result = await conn.ExecuteAsync(sql, entity);

        //    return result;
        //}

    }


}
