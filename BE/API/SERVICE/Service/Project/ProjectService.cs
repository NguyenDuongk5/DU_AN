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
        private readonly IActivityRepo _activityRepo; // Thêm dòng này

        public ProjectService(IProjectRepo repo, IActivityRepo activityRepo) // Thêm tham số ở đây
            : base(repo)
        {
            _repo = repo;
            _activityRepo = activityRepo; // Thêm dòng này
        }

        public async Task<ProjectDto> GetById(Guid id)
        {
            return await _repo.GetById(id);
        }

        public async Task<bool> Update(ProjectEntity entity)
        {
            entity.ngay_cap_nhat = DateTime.Now;
            var res = await _repo.Update(entity);
            if (res) await _activityRepo.InsertLog(entity.id_nguoi_tao, $"Cập nhật dự án: {entity.tieu_de}");
            return res;
        }

        public async Task<bool> JoinProject(JoinProjectDto dto)
        {
            var res = await _repo.JoinProject(dto);
            if (res) await _activityRepo.InsertLog(dto.id_nguoi_dung, "Yêu cầu tham gia dự án");
            return res;
        }

        public async Task<bool> Insert(ProjectEntity e)
        {
            e.id = Guid.NewGuid();
            e.ngay_tao = DateTime.Now;
            e.ngay_cap_nhat = DateTime.Now;

            var res = await _repo.Insert(e);
            if (res) await _activityRepo.InsertLog(e.id_nguoi_tao, $"Tạo dự án mới: {e.tieu_de}");
            return res;
        }

        public async Task<int> DeleteProject(Guid id)
        {
            var project = await _repo.GetById(id);
            var res = await _repo.DeleteProject(id);
            if (res > 0 && project != null)
                await _activityRepo.InsertLog(project.id_nguoi_tao, $"Xóa dự án: {project.tieu_de}");
            return res;
        }

        public async Task<List<ProjectMemberDto>> GetMembersByProjectId(Guid projectId)
        {
            return await _repo.GetMembersByProjectId(projectId);
        }

        public async Task<bool> RemoveMember(Guid idNguoiDung, Guid idDuAn)
        {
            var res = await _repo.RemoveMember(idNguoiDung, idDuAn);
            if (res) await _activityRepo.InsertLog(idNguoiDung, "Rời khỏi dự án/Bị xóa khỏi dự án");
            return res;
        }
    }
}