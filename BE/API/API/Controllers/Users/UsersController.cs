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
    /// <summary>
    /// khai báo service riêng cho user
    /// </summary>
    private readonly IUsersService _service;

    /// <summary>
    /// Khai báo repo để lấy nhật ký hoạt động
    /// </summary>
    private readonly IActivityRepo _activityRepo; 

    /// <summary>
    /// Cấu trúc Constructor
    /// </summary>
    /// <param name="usersService"></param>
    /// <param name="activityRepo"></param>
    public UsersController(IUsersService usersService, IActivityRepo activityRepo) : base(usersService)
    {
        _service = usersService;
        _activityRepo = activityRepo;
    }

    /// <summary>
    /// ath: NVTDuong
    /// date: 22/2/26
    /// API lấy danh sách dự án của một người dùng
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
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

    /// <summary>
    /// ath: NVTDuong
    /// date: 22/2/26
    /// Cập nhật thông tin người dùng
    /// </summary>
    /// <param name="id"></param>
    /// <param name="request"></param>
    /// <returns></returns>
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

    /// <summary>
    /// ath: NVTDuong
    /// date: 22/2/26
    /// API lấy thông tin người dùng theo id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public override async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var result = await _service.GetById(id);
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
    /// ath: NVTDuong
    /// date: 22/2/26
    /// API lấy danh sách bài đăng của một người
    /// </summary>
    [HttpGet("{id}/post")]
    public async Task<IActionResult> GetPostsByUserId(Guid id)
    {
        var result = await _service.GetPostsByUserId(id);
        return Ok(result);
    }

    /// <summary>
    /// ath: NVTDuong
    /// date: 22/2/26
    /// API duyệt thành viên theo idDuAn
    /// </summary>
    /// <param name="idNguoiDung"></param>
    /// <param name="idDuAn"></param>
    /// <returns></returns>
    [HttpPut("approve")]
    public async Task<IActionResult> ApproveMember(Guid idNguoiDung, Guid idDuAn)
    {
        var result = await _service.ApproveMember(idNguoiDung, idDuAn);

        if (!result)
            return NotFound(new { message = "Không tìm thấy thành viên" });

        return Ok(new { message = "Duyệt thành công" });
    }

    /// <summary>
    /// ath: NVTDuong
    /// date: 25/2/26
    /// API Khóa or mở tài khoản người dùng (Admin)
    /// </summary>
    /// <param name="id"></param>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut("status/{id}")]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] StatusRequest request)
    {
        var result = await _service.UpdateStatus(id, request.trang_thai);
        if (!result) return BadRequest("Cập nhật trạng thái thất bại");
        return Ok(new { message = "Thành công" });
    }

    /// <summary>
    /// ath: Lanh
    /// date: 25/2/26
    /// API xóa user
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpDelete("delete-user/{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteUser(id);
        if (!result) return BadRequest("Xóa thất bại");
        return Ok(new { message = "Xóa thành công" });
    }

    /// <summary>
    /// ath: NVTDuong
    /// date: 25/2/26
    /// API đăng xuất
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpPost("logout/{id}")]
    public async Task<IActionResult> Logout(Guid id)
    {
        /// ghi log hoạt động vào bản activity
        await _activityRepo.InsertLog(id, "Đã đăng xuất khỏi hệ thống");
        return Ok(true);
    }
}
/// <summary>
/// Model request dùng để cập nhật trạng thái user
/// </summary>
public class StatusRequest
{
    public int trang_thai { get; set; }
}