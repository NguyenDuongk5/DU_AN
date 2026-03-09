using DAL.Entity.Post.Dto;
using DAL.Entity.Post.Entity;
using DAL.Entity.Project;
using DAL.IRepo.Post;
using SERVICE.Base.Service;
using SERVICE.IService.Post;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SERVICE.Service.Post
{
    public class PostService : BaseService<PostEntity, PostDto>, IPostService
    {
        private readonly IPostRepo _repo;
        public PostService(IPostRepo repo)
            : base(repo)
        {
            _repo = repo;
        }

        protected override async Task<List<PostDto>> AfterGetAllData(List<PostDto> data)
        {
            // sắp xếp bài đăng theo ngày cập nhật mới nhất
            data = data.OrderByDescending(x => x.ngay_cap_nhat).ToList();
            return data;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm lấy danh sách bài đăng theo idDuAn
        /// </summary>
        /// <param name="idDuAn"></param>
        /// <returns></returns>
        public async Task<IEnumerable<PostDto>> GetByDuAnId(Guid idDuAn)
        {
            return await _repo.GetByDuAnId(idDuAn);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm cập nhật thông tin bài đăng
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public async Task<bool> Update(PostEntity e)
        {
            return await _repo.Update(e);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm thêm mời bài đăng 
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public async Task<bool> Insert(PostEntity e)
        {
            e.id_bai_dang = Guid.NewGuid();
            e.ngay_tao = DateTime.Now;
            e.ngay_cap_nhat = DateTime.Now;

            return await _repo.Insert(e);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Hàm cập nhật trạng thái bài đăng
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<bool> UpdateStatus(Guid id, int status)
        {
            return await (_repo.UpdateStatus(id, status));
        }


    }
}
