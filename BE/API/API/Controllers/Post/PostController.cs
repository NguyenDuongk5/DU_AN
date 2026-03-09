using API.Controllers.Base;
using DAL.Entity.Post.Dto;
using DAL.Entity.Post.Entity;
using DAL.Entity.Project;
using Microsoft.AspNetCore.Mvc;
using SERVICE.IService.Post;

namespace API.Controllers.Post
{
    [ApiController]
    [Route("api/post")]
    public class PostController : BaseController<PostEntity, PostDto>
    {
        /// <summary>
        /// khai báo service riêng cho post
        /// </summary>
        private readonly IPostService _postService;
        public PostController(IPostService postService) : base(postService) { 
            _postService = postService;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API lấy bài đăng theo idDuAn
        /// </summary>
        /// <param name="idDuAn"></param>
        /// <returns></returns>
        [HttpGet("project/{idDuAn}")]
        public async Task<IActionResult> GetByDuAnId(Guid idDuAn)
        {
            var data = await _postService.GetByDuAnId(idDuAn);
            return Ok(data);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API cập nhật bài đăng theo id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="e"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] PostEntity e)
        {
            e.id_bai_dang = id;

            var ok = await _postService.Update(e);

            if (!ok)
                return BadRequest("Cập nhật thất bại");

            return Ok(ok);
        }


        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API thêm bài đăng
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPost]
        public override async Task<IActionResult> Insert([FromBody] PostEntity entity)
        {
            var ok = await _postService.Insert(entity);

            if (!ok)
                return BadRequest("Thêm thất bại");

            return Ok(ok);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API cập nhật trạng thái trong bài đăng theo id (Duyệt bài đăng)
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var result = await _postService.UpdateStatus(id, 1);

            if (!result)
                return BadRequest();

            return Ok();
        }


    }

}
