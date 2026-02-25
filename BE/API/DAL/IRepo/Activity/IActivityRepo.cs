using DAL.Base.IRepo;
using DAL.Entity.Activity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.IRepo.Activity
{
    public interface IActivityRepo : IBaseRepo<ActivityEntity, ActivityDto>
    {
        Task<List<UserActivityFullDto>> GetLogsWithUserInfo(Guid? userId, DateTime? fromDate, DateTime? toDate);
        // Thêm hàm này
        Task<bool> InsertLog(Guid userId, string action);
    }
}
