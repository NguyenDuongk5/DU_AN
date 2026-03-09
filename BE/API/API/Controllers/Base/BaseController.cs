using DAL.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SERVICE.Base.IService;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Controllers.Base
{
    [ApiController]

    public class BaseController<Entity, Dto> : ControllerBase
        
    {
        /// <summary>
        /// khai báo service
        /// </summary>
        private readonly IBaseService<Entity, Dto> _baseService;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="baseService"></param>
        public BaseController(IBaseService<Entity, Dto> baseService)
        {
            _baseService = baseService;
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API lấy toàn bộ dữ liệu
        /// </summary>
        /// <returns></returns>
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _baseService.GetAll();
            return Ok(result);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API thêm mới  dữ liệu
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        [HttpPost]
        public virtual async Task<IActionResult> Insert(Entity entity)
        {
            var result = await _baseService.Insert(entity);
            return Ok(result);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API xóa dữ liệu theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete(Guid id)
        {
            var result = await _baseService.Delete(id);
            return Ok(result);
        }

        /// <summary>
        /// ath: NVTDuong
        /// date: 22/2/26
        /// API lấy dữ liệu theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetById(Guid id)
        {
            var result = await _baseService.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

    }
}
