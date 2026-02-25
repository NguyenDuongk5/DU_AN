using DAL.Entity.Comment;
using DAL.IRepo.Comment;
using DAL.IRepo.Activity; // Thêm dòng này
using SERVICE.Base.Service;
using SERVICE.IService.Comment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SERVICE.Service.Comment
{
    public class CommentService : BaseService<CommentEntity, CommentDto>, ICommentService
    {
        private readonly ICommentRepo _repo;
        private readonly IActivityRepo _activityRepo; // Thêm dòng này

        public CommentService(ICommentRepo repo, IActivityRepo activityRepo) : base(repo) // Thêm tham số ở đây
        {
            _repo = repo;
            _activityRepo = activityRepo; // Thêm dòng này
        }

        public async Task<IEnumerable<CommentDto>> GetCmtByPostId(Guid PostId)
        {
            return await _repo.GetCmtByPostId(PostId);
        }

        public async Task<bool> Update(CommentEntity e)
        {
            return await _repo.Update(e);
        }

        public async Task<bool> Insert(CommentEntity e)
        {
            var res = await _repo.Insert(e);
            if (res) await _activityRepo.InsertLog(e.id_nguoi_dung, "Đã viết một bình luận");
            return res;
        }
    }
}