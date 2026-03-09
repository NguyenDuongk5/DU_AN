using DAL.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SERVICE.Base.IService
{
    public interface IBaseService<Entity, Dto>
    {
        Task<List<Entity>> GetAll();

        Task<int> Insert(Entity entity);

        Task<BaseResult> Delete(Guid pkId);

        Task<Entity> GetById(Guid id);

        //Task<int> Update(Entity entity);
    }
}
