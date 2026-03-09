using Microsoft.AspNetCore.Mvc;
using SERVICE.IService.Users;
using DAL.Entity.Users;

[ApiController]
[Route("api/users")]
public class AuthController : ControllerBase
{
    private readonly IUsersService _userService;

    public AuthController(IUsersService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// ath: NVTDuong
    /// date: 22/2/26
    /// API đăng ký tài khoản
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var result = await _userService.Register(request);
        if (result == "Thành công") return Ok(new { message = result });
        return BadRequest(new { message = result });
    }

    /// <summary>
    /// ath: NVTDuong
    /// date: 22/2/26
    /// API đăng nhập
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (request == null)
                return BadRequest(new { message = "Dữ liệu gửi lên rỗng" });

            var result = await _userService.Login(request);

            if (result == null)
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác" });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    /// <summary>
    /// ath: NVTDuong
    /// date: 22/2/26
    /// API đổi mật khẩu
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPut("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var result = await _userService.ForgotPassword(request);

        if (!result)
            return BadRequest(new { message = "Mật khẩu hiện tại không đúng" });

        return Ok(new { message = "Đổi mật khẩu thành công" });
    }

}