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
        /// <summary>
        /// Repo thao tác dữ liệu cmt
        /// </summary>
        private readonly ICommentRepo _repo;

        /// <summary>
        /// Repo ghi log hoạt động người dùng
        /// </summary>
        private readonly IActivityRepo _activityRepo; 

        public CommentService(ICommentRepo repo, IActivityRepo activityRepo) : base(repo) 
        {
            _repo = repo;
            _activityRepo = activityRepo; 
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy danh sách bình luận theo id bài đăng
        /// </summary>
        /// <param name="PostId"></param>
        /// <returns></returns>
        public async Task<IEnumerable<CommentDto>> GetCmtByPostId(Guid PostId)
        {
            return await _repo.GetCmtByPostId(PostId);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Cập nhật nội dung bình luận
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public async Task<bool> Update(CommentEntity e)
        {
            return await _repo.Update(e);
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Thêm mới bình luận
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public async Task<bool> Insert(CommentEntity e)
        {
            // lưu vào db
            var res = await _repo.Insert(e);
            // ghi log nếu thành công
            if (res) await _activityRepo.InsertLog(e.id_nguoi_dung, "Đã viết một bình luận");
            return res;
        }
    }
}