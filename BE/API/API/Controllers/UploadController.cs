using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 25/2/26
        /// Upload ảnh từ client
        /// </summary>
        /// <param name="file">file ảnh</param>
        /// <returns>tên file đã lưu</returns>
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                // kiểm tra file
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Không có file được chọn"
                    });
                }

                // kiểm tra định dạng ảnh hợp lệ
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

                var extension = Path.GetExtension(file.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Chỉ cho phép file ảnh (.jpg, .jpeg, .png, .gif, .webp)"
                    });
                }

                // tạo folder Uploads nếu chưa có
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "Uploads");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // tạo tên file mới
                var newFileName = Guid.NewGuid().ToString() + extension;

                var filePath = Path.Combine(uploadsFolder, newFileName);

                // lưu file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // trả về tên file và url
                var fileUrl = $"{Request.Scheme}://{Request.Host}/Uploads/{newFileName}";

                return Ok(new
                {
                    success = true,
                    fileName = newFileName,
                    url = fileUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Upload thất bại",
                    error = ex.Message
                });
            }
        }
    }
}