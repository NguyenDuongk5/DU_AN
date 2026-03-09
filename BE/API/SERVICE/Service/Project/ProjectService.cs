using DAL.Entity.Post.Dto;
using DAL.Entity.project;
using DAL.Entity.Project;
using DAL.IRepo.Post;
using DAL.IRepo.Project;
using DAL.IRepo.Activity; // Thêm dòng này
using DAL.Repo.Project;
using SERVICE.Base.Service;
using SERVICE.IService.Project;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SERVICE.Service.Project
{
    public class ProjectService : BaseService<ProjectEntity, ProjectDto>, IProjectService
    {
        private readonly IProjectRepo _repo;

        /// <summary>
        /// Repository ghi log hoạt động người dùng
        /// </summary>
        private readonly IActivityRepo _activityRepo; 
        
        public ProjectService(IProjectRepo repo, IActivityRepo activityRepo) 
            : base(repo)
        {
            _repo = repo;
            _activityRepo = activityRepo; 
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy thông tin chi tiết dự án theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<ProjectDto> GetById(Guid id)
        {
            return await _repo.GetById(id);
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Cập nhật thông tin dự án
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<bool> Update(ProjectEntity entity)
        {
            entity.ngay_cap_nhat = DateTime.Now;
            var res = await _repo.Update(entity);
            // Nếu cập nhật thành công thì ghi log
            if (res)
            {
                await _activityRepo.InsertLog(entity.id_nguoi_tao, $"Cập nhật dự án: {entity.tieu_de}");
            }
            return res;
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Người dùng gửi yêu cầu tham gia dự án
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<bool> JoinProject(JoinProjectDto dto)
        {
            var res = await _repo.JoinProject(dto);
            // Nếu cập nhật thành công thì ghi log
            if (res)
            {
                await _activityRepo.InsertLog(dto.id_nguoi_dung, "Yêu cầu tham gia dự án");
            }
            return res;
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Tạo dự án mới
        /// </summary>
        /// <param name="e"></param>
        /// <returns></returns>
        public async Task<bool> Insert(ProjectEntity e)
        {
            e.id = Guid.NewGuid();
            e.ngay_tao = DateTime.Now;
            e.ngay_cap_nhat = DateTime.Now;

            var res = await _repo.Insert(e);
            // Nếu cập nhật thành công thì ghi log
            if (res)
            {
                await _activityRepo.InsertLog(e.id_nguoi_tao, $"Tạo dự án mới: {e.tieu_de}");
            }
            return res;
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Xóa dự án
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<int> DeleteProject(Guid id)
        {
            var project = await _repo.GetById(id);
            var res = await _repo.DeleteProject(id);
            // Nếu cập nhật thành công thì ghi log
            if (res > 0 && project != null)
            {
                await _activityRepo.InsertLog(project.id_nguoi_tao, $"Xóa dự án: {project.tieu_de}");
            }
            return res;
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// Lấy danh sách thành viên của dự án
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        public async Task<List<ProjectMemberDto>> GetMembersByProjectId(Guid projectId)
        {
            return await _repo.GetMembersByProjectId(projectId);
        }
        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Xóa thành viên khỏi dự án hoặc người dùng tự rời dự án
        /// </summary>
        /// <param name="idNguoiDung"></param>
        /// <param name="idDuAn"></param>
        /// <returns></returns>
        public async Task<bool> RemoveMember(Guid idNguoiDung, Guid idDuAn)
        {
            var res = await _repo.RemoveMember(idNguoiDung, idDuAn);
            // Nếu cập nhật thành công thì ghi log
            if (res) { 
                await _activityRepo.InsertLog(idNguoiDung, "Rời khỏi dự án/Bị xóa khỏi dự án"); 
            }
            return res;
        }
    }
}