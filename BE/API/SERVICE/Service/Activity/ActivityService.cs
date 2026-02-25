using DAL.Entity.Activity;
using DAL.IRepo.Activity;
using SERVICE.Base.Service;
using SERVICE.IService.Activity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SERVICE.Service.Activity
{
    public class ActivityService : BaseService<ActivityEntity, ActivityDto>, IActivityService
    {
        private readonly IActivityRepo _repo;

        public ActivityService(IActivityRepo repo) : base(repo)
        {
            _repo = repo;
        }

        public async Task<List<UserActivityFullDto>> GetFilteredLogs(Guid? userId, DateTime? fromDate, DateTime? toDate)
        {
            return await _repo.GetLogsWithUserInfo(userId, fromDate, toDate);
        }
    }
}
