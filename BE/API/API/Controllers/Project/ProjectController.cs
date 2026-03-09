using API.Controllers.Base;
using DAL.Entity.Post.Dto;
using DAL.Entity.Post.Entity;
using DAL.Entity.project;
using DAL.Entity.Project;
using Microsoft.AspNetCore.Mvc;
using SERVICE.IService.Post;
using SERVICE.IService.Project;
using SERVICE.Service.Post;
using SERVICE.Service.Project;

namespace API.Controllers.Project
{
    [ApiController]
    [Route("api/project")]
    public class ProjectController : BaseController<ProjectEntity, ProjectDto>
    {
        /// <summary>
        /// Khai báo service riêng cho project
        /// </summary>
        private readonly IProjectService _projectService;
        public ProjectController(IProjectService projectService) : base(projectService)
        {
            _projectService = projectService;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API lấy dự án theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public override async Task<IActionResult> GetById(Guid id)
        {
            var result = await _projectService.GetById(id);
            return Ok(result);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API cập nhật dự án theo id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProjectEntity entity)
        {
            if (id != entity.id) return BadRequest("Id không khớp");

            var ok = await _projectService.Update(entity);
            if (!ok) return BadRequest("Update thất bại");

            return Ok(ok);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API tham gia dự án
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPost("join")]
        public  async Task<IActionResult> JoinProject([FromBody] JoinProjectDto dto)
        {
            if (dto.id_nguoi_dung == Guid.Empty || dto.id_du_an == Guid.Empty)
                return BadRequest("Thiếu dữ liệu");

            var result = await _projectService.JoinProject(dto);

            if (!result)
                return BadRequest("Bạn đã tham gia hoặc lỗi");

            return Ok(new { message = "Join project thành công" });
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API thêm project mới
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPost]
        public override async Task<IActionResult> Insert([FromBody] ProjectEntity entity)
        {
            if (entity == null)
                return BadRequest("Dữ liệu không hợp lệ");

            var ok = await _projectService.Insert(entity);

            if (!ok)
                return BadRequest("Thêm dự án thất bại");

            // TỰ ĐỘNG JOIN nguoi_tham_gia
            var joinDto = new JoinProjectDto
            {
                id_du_an = entity.id,
                id_nguoi_dung = entity.id_nguoi_tao
            };

            await _projectService.JoinProject(joinDto);

            return Ok(new
            {
                message = "Thêm dự án thành công",
                id = entity.id
            });
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API xóa dự án theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public override async Task<IActionResult> Delete(Guid id)
        {
            var result = await _projectService.DeleteProject(id);
            return Ok(result);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API lấy dang sách thành viên
        /// </summary>
        /// <param name="ProjectId"></param>
        /// <returns></returns>
        [HttpGet("member/{ProjectId}")]
        public async Task<IActionResult> GetMembersByProjectId(Guid ProjectId)
        {
            var data = await _projectService.GetMembersByProjectId(ProjectId);
            return Ok(data);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API xóa thành viên khỏi dự án
        /// </summary>
        /// <param name="idNguoiDung"></param>
        /// <param name="idDuAn"></param>
        /// <returns></returns>
        [HttpDelete("member")]
        public async Task<IActionResult> RemoveMember(Guid idNguoiDung, Guid idDuAn)
        {
            var result = await _projectService.RemoveMember(idNguoiDung, idDuAn);

            if (result)
                return Ok(new { message = "Đã xóa thành viên khỏi dự án" });

            return BadRequest(new { message = "Xóa thất bại" });
        }

    }
}
