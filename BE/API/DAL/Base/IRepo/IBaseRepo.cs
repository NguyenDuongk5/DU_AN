using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Base.IRepo
{
    public interface IBaseRepo<Entity, Dto>
    {
        /// <summary>
        /// Lấy toàn bộ dữ liệu trong bảng
        /// </summary>
        /// <returns></returns>
        Task<List<Entity>> GetAll();

        /// <summary>
        /// Thêm dữ liệu vào database
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        Task<int> Insert(Entity entity);

        /// <summary>
        /// Xóa dữ liệu theo khóa chính (Guid)
        /// </summary>
        /// <param name="pkId"></param>
        /// <returns></returns>
        Task<int> Delete(Guid pkId);

        /// <summary>
        /// Lấy 1 bản ghi theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<Entity?> GetById(Guid id);

        //Task<int> Update(Entity entity);


    }
}
