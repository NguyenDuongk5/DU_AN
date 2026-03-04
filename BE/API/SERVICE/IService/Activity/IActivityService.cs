using DAL.Entity.Activity;
using SERVICE.Base.IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SERVICE.IService.Activity
{
    public interface IActivityService : IBaseService<ActivityEntity, ActivityDto>
    {
        Task<List<UserActivityFullDto>> GetFilteredLogs(Guid? userId);
    }
}
