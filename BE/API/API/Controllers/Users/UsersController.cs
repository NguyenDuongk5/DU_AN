using API.Controllers.Base;
using DAL.Entity.Post.Dto;
using DAL.Entity.Users;
using DAL.IRepo.Activity; // Thêm dòng này
using Microsoft.AspNetCore.Mvc;
using SERVICE.IService.Users;
using SERVICE.Service.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/users")]
public class UsersController : BaseController<UsersEntity, UsersDto>
{
    private readonly IUsersService _service;
    private readonly IActivityRepo _activityRepo; // Thêm dòng này

    // Cấu trúc Constructor giữ nguyên, chỉ thêm IActivityRepo
    public UsersController(IUsersService usersService, IActivityRepo activityRepo) : base(usersService)
    {
        _service = usersService;
        _activityRepo = activityRepo; // Gán giá trị
    }

    /// <summary>
    /// Lấy danh sách dự án của một người dùng cụ thể
    /// </summary>
    [HttpGet("{id}/projects")]
    public async Task<IActionResult> GetUserProjects(Guid id)
    {
        try
        {
            var result = await _service.GetUserProjects(id);
            if (result == null || !result.Any())
            {
                return NotFound(new { message = "Không tìm thấy dự án nào cho người dùng này." });
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        var dto = new UsersDto
        {
            id_nguoi_dung = id,
            hoten = request.hoten,
            email = request.email
        };

        var result = await _service.UpdateUser(dto);

        if (!result)
            return BadRequest("Cập nhật thất bại");

        return Ok("Cập nhật thành công");
    }

    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var result = await _service.GetById(id); // Sửa lại gọi GetById thay vì GetUserProjects để đúng logic
            if (result == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng." });
            }
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Lấy danh sách bài đăng của một người dùng cụ thể
    /// </summary>
    [HttpGet("{id}/post")]
    public async Task<IActionResult> GetPostsByUserId(Guid id)
    {
        var result = await _service.GetPostsByUserId(id);
        return Ok(result);
    }

    [HttpPut("approve")]
    public async Task<IActionResult> ApproveMember(Guid idNguoiDung, Guid idDuAn)
    {
        var result = await _service.ApproveMember(idNguoiDung, idDuAn);

        if (!result)
            return NotFound(new { message = "Không tìm thấy thành viên" });

        return Ok(new { message = "Duyệt thành công" });
    }

    // ============================================================
    // PHẦN QUẢN TRỊ VIÊN (KHÓA & XÓA)
    // ============================================================

    [HttpPut("status/{id}")]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] StatusRequest request)
    {
        var result = await _service.UpdateStatus(id, request.trang_thai);
        if (!result) return BadRequest("Cập nhật trạng thái thất bại");
        return Ok(new { message = "Thành công" });
    }

    [HttpDelete("delete-user/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteUser(id);
        if (!result) return BadRequest("Xóa thất bại");
        return Ok(new { message = "Xóa thành công" });
    }

    [HttpPost("logout/{id}")]
    public async Task<IActionResult> Logout(Guid id)
    {
        // Hàm này dùng chung cho cả Admin và Người dùng cơ bản
        // Chỉ cần truyền đúng ID của người đang thực hiện đăng xuất
        await _activityRepo.InsertLog(id, "Đã đăng xuất khỏi hệ thống");
        return Ok(true);
    }
}

// CHÈN VÀO DƯỚI CÙNG FILE
public class StatusRequest
{
    public int trang_thai { get; set; }
}